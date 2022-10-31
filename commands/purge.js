const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')
const checkUserPerms = require('../utils/checkUserPerms')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel')
        .setDescription('Purge messages by channel')
        .addNumberOption(option => option.setName('amount').setDescription('Amount of messages to purge (max 100)').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Channel to purge messages in'))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Purge messages by user')
        .addUserOption(option => option.setName('user').setDescription('User to purge messages for').setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription('Amount of messages to purge (max 100)').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('Channel to purge messages in'))
    ),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const amount = interaction.options.getNumber('amount')
    const channel = interaction.options.getChannel('channel') || interaction.channel
    const user = interaction.options.getUser('user')

    if (amount > 100) return interaction.reply('You can only purge up to 100 messages at once.')
    if (amount < 1) return interaction.reply('You must purge at least 1 message.')

    const command = interaction.options.getSubcommand()
    if (command === 'channel') {
      await channel.bulkDelete(amount)
      await interaction.reply({
        embeds: [
          {
            title: `Purged ${amount} message${amount === 1 ? '' : 's'} in #${channel.name}!`,
            color: accent
          }
        ],
        ephemeral: true
      })
      log(interaction.guild, 'purge', {
        moderator: {
          id: interaction.user.id
        },
        channel: {
          id: channel.id
        },
        amount
      })
      return
    } else if (command === 'user') {
      const messages = channel.messages.fetch({ limit: 100 })
      const userMessages = (await messages)
        .filter(m => m.author.id === user.id)
        .toJSON()
        .splice(0, amount)
      if (userMessages.length === 0) return interaction.reply('Could not find any messages by that user.')
      await channel.bulkDelete(userMessages)
      await interaction.reply({
        embeds: [
          {
            title: `Purged ${amount} message${amount == 1 ? '' : 's'} by ${user.tag} in #${channel.name}!`,
            color: accent
          }
        ],
        ephemeral: true
      })
      log(interaction.guild, 'purge', {
        target: {
          id: user.id,
          tag: user.tag
        },
        moderator: {
          id: interaction.user.id
        },
        channel: {
          id: channel.id
        },
        amount
      })
      return
    }
  }
}
