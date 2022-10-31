const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('saveemoji')
    .setDescription('Converts an emoji to an image.')
    .addStringOption(option => option.setName('emoji').setDescription('Emoji to convert').setRequired(true)),
  async execute(interaction) {
    const emojiName = interaction.options.getString('emoji')
    const isCustom = emojiName.startsWith('<:') && emojiName.endsWith('>')
    const emoji = isCustom ? `https://cdn.discordapp.com/emojis/${emojiName.match(/[0-9]+/)[0]}.png` : `https://emojicdn.elk.sh/${emojiName}?style=apple`
    return interaction.reply(emoji)
  }
}
