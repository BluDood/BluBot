const { SlashCommandBuilder } = require('discord.js')
const checkUserPerms = require('../utils/checkUserPerms')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Echo a message as the bot user')
    .addStringOption(option => option.setName('message').setDescription('Message to echo').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('Channel to echo to')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const message = interaction.options.getString('message')
    const channel = interaction.options.getChannel('channel') || interaction.channel
    const sent = await channel.send(message).catch(() => null)

    if (!sent)
      return interaction.reply({
        content: 'I could not send a message to that channel!',
        ephemeral: true
      })

    return interaction.reply({
      content: `Successfully echoed that message to <#${channel.id}>`,
      ephemeral: true
    })
  }
}
