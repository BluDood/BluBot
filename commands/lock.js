const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a channel"),
  async execute(interaction) {
    // Check for moderating role
    const memberRoles = interaction.member.roles.cache.map((r) => r.id);
    if (!memberRoles.some((v) => config.allowRoles.includes(v)))
      return interaction.reply(
        "You do not have permission to execute this command!"
      );

    // @everyone SEND_MESSAGES = false
    interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SEND_MESSAGES: false,
      }
    );
    interaction.reply("Channel locked");
  },
};
