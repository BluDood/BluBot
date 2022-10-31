const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')
const checkUserPerms = require('../utils/checkUserPerms')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to lock')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const channel = interaction.options.getChannel('channel') || interaction.channel
    if (!channel) return interaction.reply('I cannot access that channel!')
    if (!channel.permissionsFor(interaction.guild.roles.everyone).has('SEND_MESSAGES')) return interaction.reply('This channel is already locked!')
    try {
      channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SEND_MESSAGES: false
      })
      await interaction.reply({
        embeds: [
          {
            title: `#${channel.name} locked.`,
            color: accent
          }
        ]
      })
      log(interaction.guild, 'lock', {
        channel: {
          id: channel.id,
          name: channel.name
        },
        moderator: {
          id: interaction.user.id
        }
      })
    } catch (error) {
      console.log(error)
      interaction.reply('I cannot lock that channel!')
    }
  }
}
