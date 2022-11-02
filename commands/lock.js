const { SlashCommandBuilder, PermissionsBitField } = require('discord.js')
const config = require('../utils/config')
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
    if (!channel.permissionsFor(interaction.guild.roles.everyone).has(PermissionsBitField.Flags.SendMessages)) return interaction.reply('This channel is already locked!')
    try {
      channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        [PermissionsBitField.Flags.SendMessages]: false
      })
      await interaction.reply({
        embeds: [
          {
            title: `#${channel.name} locked.`,
            color: config.getColor('accent')
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
