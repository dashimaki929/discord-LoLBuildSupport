const fs = require("fs");
const {
  toFullWidthKana,
  foramtPositionName,
  getCorrectChampionName,
  calculateIntentedChampionName
} = require("../common/util");

module.exports = (message) => {
  const [_, inputChampionName, inputPosition] = message.content.split(/\s/g);

  if (inputChampionName) {
    const champions = JSON.parse(fs.readFileSync("./config/champions.json"));

    let championName;
    if (/^\w+$/.test(inputChampionName)) {
      /* チャンピオン名が英語のみで入力されている場合 */
      championName = calculateIntentedChampionName(inputChampionName, Object.values(champions));
    } else {
      /* チャンピオン名に英語以外が含まれている場合 */
      const jpChampionName = calculateIntentedChampionName(
        toFullWidthKana(inputChampionName), // 全角カタカナへ正規化
        Object.keys(champions)
      );
      championName = champions[jpChampionName];
    }

    let displayName = toFullWidthKana(inputChampionName);
    if (displayName !== championName) {
      displayName = getCorrectChampionName(championName, champions);
      displayName += `(${championName})`;
    }

    const position = foramtPositionName(inputPosition);
    const imageName = position ? `${championName}_${position}.png` : `${championName}.png`;

    message.channel.send({
      embed: {
        color: 0x5cb85c,
        author: {
          name: "LoL Build Support",
          url: "https://github.com/dashimaki929/discord-LoLBuildSupport",
          iconURL: "attachment://icon.png",
        },
        title: `【U.GG】${championName.toUpperCase()} - Real-time LoL Stats.`,
        url: `http://na.op.gg/champion/${championName}${position ? `/statistics/${position}` : ""}`,
        thumbnail: {
          url: `attachment://thumbnail_${championName}.png`,
        },
        description: `\<@${message.author.id}\> \`${displayName}\` ${position ? `\`${position}\` ` : ""}`,
        image: {
          url: `attachment://${imageName}`,
          width: 500,
        },
        fields: [
          {
            name: ":regional_indicator_u: U.GG (more info)",
            value: `https://u.gg/lol/champions/${championName}/build${position ? `?role=${position}` : ""}`,
          },
          {
            name: ":book: OP.GG",
            value: `https://na.op.gg/champion/${championName}`,
          },
          {
            name: ":regional_indicator_l: League of Graphs",
            value: `https://www.leagueofgraphs.com/ja/champions/builds/${championName}`,
          },
          {
            name: ":flag_jp: LoLBuild.jp",
            value: `https://lolbuild.jp/build?q=${championName}&order=vote_desc${position ? `&lane=${position}` : ""}`,
          },
        ],
        timestamp: new Date(),
      },
      files: [
        {
          attachment: "./config/icon.png",
          name: "icon.png",
        },
        {
          attachment: `./img/champions/${championName}.png`,
          name: `thumbnail_${championName}.png`,
        },
        {
          attachment: `./img/cache/u.gg/${imageName}`,
          name: imageName,
        },
      ],
    });
  }
}
