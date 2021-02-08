const settings = require("./config/settings");
const { cmd_lol } = require("./src/commands/");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Boot completed successfully!");
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;

  if (isCommand(message, "lol")) {
    cmd_lol(message);
  }
});

client.login(settings.Bot.token);

/**
 * 呼び出しコマンドチェック
 * 
 * @param {*} message 
 * @param {*} cmd_name 
 */
function isCommand(message, cmd_name) {
  return message.content.startsWith(`${settings.prefix}${cmd_name}`);
}
