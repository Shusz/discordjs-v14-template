const { GatewayIntentBits, REST, Routes } = require("discord.js");

const prompt = require("prompt-sync")(),
  fs = require("fs"),
  discordjs = require("discord.js");

var settings = JSON.parse(fs.readFileSync("settings.json"));
process.on("uncaughtException", (error, orgi) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hour = date_ob.getHours();
  let min = date_ob.getMinutes();
  let sec = date_ob.getSeconds();
  fs.appendFileSync(
    "log",
    `[ERROR] [${year}/${month}/${date} | ${hour}:${min}:${sec}] An error has occured: \n` +
      error +
      `\n(origin): ` +
      orgi +
      "\n"
  );
});
const bot = new discordjs.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});
bot.commands = new discordjs.Collection();
const commands = [];
fs.readdirSync("./commands").forEach(async (file) => {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  bot.commands.set(command.data.name, command);
});
fs.readdirSync("./events").forEach(async (file) => {
  const event = require(`./events/${file}`);
  if (event.once) {
    bot.once(event.name, (...args) => event.execute(...args));
  } else {
    bot.on(event.name, (...args) => event.execute(...args));
  }
});
const rest = new REST({ version: "10" }).setToken(settings["bot"]["token"]);
(async () => {
  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(
        settings.bot.clientID,
        settings.bot.guildID
      ),
      { body: commands }
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

bot.on(discordjs.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.run(bot, interaction);
  } catch (error) {
    console.error(error);
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let min = date_ob.getMinutes();
    let sec = date_ob.getSeconds();
    fs.appendFileSync(
      "log",
      `[ERROR] [${year}/${month}/${date} | ${hour}:${min}:${sec}] An error has occured: \n` +
        error
    );
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

bot.login(settings.bot.token);
