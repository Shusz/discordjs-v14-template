const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
  run: async (bot, interaction) => {
    interaction.reply(`Pong 🏓`);
  },
};
