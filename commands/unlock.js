const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a channel"),
  async execute(interaction) {
    // Check for moderating role (not rly sure how you would be able to talk in a locked channel and not be a mod, but it's here in case)
    const memberRoles = interaction.member.roles.cache.map((r) => r.id);
    if (!memberRoles.some((v) => config.allowRoles.includes(v)))
      return interaction.reply(
        "You do not have permission to execute this command!"
      );

    // Remove @everyone override
    interaction.channel.permissionOverwrites.edit(
      interaction.guild.roles.everyone,
      {
        SEND_MESSAGES: null,
      }
    );

    interaction.reply("Channel unlocked");
  },
};
