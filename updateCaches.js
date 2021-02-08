const fs = require("fs");
const Puppeteer = require("puppeteer");

(async () => {
  let doneCnt = 0;
  const champions = JSON.parse(fs.readFileSync("./config/champions.json"));

  const browser = await Puppeteer.launch({
    // executablePath: "/usr/bin/chromium-browser",
    defaultViewport: {
      width: 1920,
      height: 2000,
    },
    timeout: 10000,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  console.log(">>>> Fetching start... >>>>");

  const championNames = Object.values(champions);
  for (let engChampionName of championNames) {
    await getBuildsScreenshot(browser, engChampionName).then(() => {
      doneCnt++;
      console.log(`${engChampionName}\t\t${doneCnt} / ${championNames.length}`);
    });
  }

  await browser.close();
  console.log("<<<< Fetching finished <<<<");
})();

async function getBuildsScreenshot(browser, engChampionName) {
  const page = await browser.newPage();
  try {
    await page.goto(`https://u.gg/lol/champions/${engChampionName}/build`, { waitUntil: 'networkidle0' });

    const element = await page.$("#content > div > div.champion-profile-content-container.content-side-padding > div > div > div.champion-profile-page > div");
    await element.screenshot({
      path: `./img/cache/${engChampionName}.png`
    });

    const positions = ["top", "jungle", "middle", "bottom", "support"];
    for (let i in positions) {
      const positionElem = await page.$(`#content > div > div.champion-profile-content-container.content-side-padding > div > div > div.filter-manager.media-query.media-query_TABLET__DESKTOP_LARGE > div > div > div.role-filter-container.media-query.media-query_TABLET__DESKTOP_LARGE.media-query.media-query_DESKTOP_MEDIUM__DESKTOP_LARGE > div:nth-child(${~~i + 1})`);
      await positionElem.click();

      await element.screenshot({
        path: `./img/cache/u.gg/${engChampionName}_${positions[i]}.png`
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await page.close();
  }
}
