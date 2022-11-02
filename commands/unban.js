const { SlashCommandBuilder } = require('discord.js')
const config = require('../utils/config')
const checkUserPerms = require('../utils/checkUserPerms')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Revokes the ban for a member.')
    .addUserOption(option => option.setName('target').setDescription('User to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the unban')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const target = interaction.options.getUser('target')
    const reason = interaction.options.getString('reason') || 'N/A'
    await interaction.guild.members.unban(target)
    await interaction.reply({
      embeds: [
        {
          title: `${target.tag} unbanned.`,
          color: config.getColor('accent')
        }
      ],
      ephemeral: true
    })
    log(interaction.guild, 'unban', {
      target: {
        id: target.id,
        tag: target.tag
      },
      moderator: {
        id: interaction.user.id
      },
      reason
    })
  }
}
