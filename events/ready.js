const { ActivityType } = require("discord.js");
module.exports = {
  name: "ready",
  once: true,
  execute(bot) {
    console.log("[INFO] Bot has been started!");
    console.log(
      `[DEBUG] ${bot.user.username}#${bot.user.discriminator} | ${bot.user.id}`
    );
  },
};
