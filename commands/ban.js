const { SlashCommandBuilder } = require('discord.js')
const config = require('../utils/config')
const checkUserPerms = require('../utils/checkUserPerms')
const directMessage = require('../utils/directMessage')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member.')
    .addUserOption(option => option.setName('target').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the ban'))
    .addNumberOption(option => option.setName('deletedays').setDescription('Days to delete messages')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const target = interaction.options.getUser('target')
    const reason = interaction.options.getString('reason') || 'N/A'
    const days = interaction.options.getNumber('deletedays') || 0
    const member = await interaction.guild.members.fetch({ user: target, force: true }).catch(() => null)
    if (!member)
      return interaction.reply({
        content: "I can't find that user!",
        ephemeral: true
      })
    if (!member.bannable)
      return interaction.reply({
        content: "I can't ban that user!",
        ephemeral: true
      })
    await interaction.reply({
      embeds: [
        {
          title: `${target.tag} banned.`,
          color: config.getColor('accent')
        }
      ],
      ephemeral: true
    })
    const dm = await directMessage(interaction.guild, target, 'ban', {
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
    await member.ban(target, { days: days, reason: reason })
    log(interaction.guild, 'ban', {
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
