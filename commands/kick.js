const { SlashCommandBuilder } = require('discord.js')
const config = require('../utils/config')
const checkUserPerms = require('../utils/checkUserPerms')
const directMessage = require('../utils/directMessage')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member.')
    .addUserOption(option => option.setName('target').setDescription('User to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the kick')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const target = interaction.options.getUser('target')
    const reason = interaction.options.getString('reason') || 'N/A'
    const member = await interaction.guild.members.fetch({ user: target, force: true }).catch(() => null)
    if (!member)
      return interaction.reply({
        content: "I can't find that user!",
        ephemeral: true
      })
    if (!member.kickable)
      return interaction.reply({
        content: "I can't kick that user!",
        ephemeral: true
      })
    await interaction.reply({
      embeds: [
        {
          title: `${target.tag} kicked.`,
          color: config.getColor('accent')
        }
      ],
      ephemeral: true
    })
    const dm = await directMessage(interaction.guild, target, 'kick', {
      reason,
      moderator: {
        id: interaction.user.id
      }
    })
    if (!dm)
      await interaction.followUp({
        content: 'I could not message that user!',
        ephemeral: true
      })
    await member.kick(reason)
    log(interaction.guild, 'kick', {
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
