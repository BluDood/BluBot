const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')
const checkUserPerms = require('../utils/checkUserPerms')
const directMessage = require('../utils/directMessage')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Time out a member.')
    .addUserOption(option => option.setName('target').setDescription('User to timeout').setRequired(true))
    .addStringOption(option => option.setName('duration').setDescription('Duration for the timeout (s, m, h, d, w, M, y)').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the timeout')),
  async execute(interaction) {
    const target = interaction.options.getUser('target')
    const reason = interaction.options.getString('reason') || 'N/A'
    const member = await interaction.guild.members.fetch({ user: target, force: true }).catch(() => null)
    if (!member)
      return interaction.reply({
        content: "I can't find that user!",
        ephemeral: true
      })
    if (!member.moderatable)
      return interaction.reply({
        content: "I can't timeout that user!",
        ephemeral: true
      })
    const durationUnits = {
      s: 1000,
      m: 60000,
      h: 3600000,
      d: 86400000,
      w: 604800000,
      M: 2592000000,
      y: 31536000000
    }
    const unitNames = {
      s: 'second',
      m: 'minute',
      h: 'hour',
      d: 'day',
      w: 'week',
      M: 'month',
      y: 'year'
    }
    const [amount, unit] =
      interaction.options
        .getString('duration')
        .match(/([0-9]+)([a-zA-Z]{1})/)
        ?.splice(1) || []
    if (!durationUnits[unit])
      return await interaction.reply({
        content: `${unit} is not a valid unit!`,
        ephemeral: true
      })
    const duration = parseInt(amount) * durationUnits[unit]
    await interaction.reply({
      embeds: [
        {
          title: `${target.tag} timed out.`,
          color: accent
        }
      ],
      ephemeral: true
    })
    const dm = await directMessage(interaction.guild, target, 'timeout', {
      reason,
      moderator: {
        id: interaction.user.id
      },
      duration: `Duration: ${amount} ${unitNames[unit]}${amount == 1 ? '' : 's'}`
    })
    if (!dm)
      await interaction.followUp({
        content: 'I could not message that user!',
        ephemeral: true
      })
    await member.timeout(duration, reason)
    log(interaction.guild, 'timeout', {
      target: {
        id: target.id,
        tag: target.tag
      },
      moderator: {
        id: interaction.user.id
      },
      reason,
      duration: `${amount} ${unitNames[unit]}${amount == 1 ? '' : 's'}`
    })
  }
}
