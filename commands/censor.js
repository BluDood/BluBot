const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')
const fs = require('fs')
const checkUserPerms = require('../utils/checkUserPerms')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('censor')
    .setDescription('Configure censored words')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a censored word')
        .addStringOption(option => option.setName('word').setDescription('The word to censor').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a censored word')
        .addStringOption(option => option.setName('word').setDescription('The word to remove').setRequired(true))
    )
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List all censored words')),
  async execute(interaction) {
    const word = interaction.options.getString('word')?.toLowerCase()
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })

    if (interaction.options.getSubcommand() === 'add') {
      const censored = JSON.parse(fs.readFileSync('./databases/censored.json'))
      if (censored.map(c => c.word).includes(word))
        return await interaction.reply({
          content: 'This word is already censored!',
          ephemeral: true
        })
      censored.push({
        user: interaction.user.id,
        word
      })
      fs.writeFileSync('./databases/censored.json', JSON.stringify(censored))
      await interaction.reply({
        content: `Censored the word ${word}!`,
        ephemeral: true
      })
    } else if (interaction.options.getSubcommand() === 'remove') {
      const censored = JSON.parse(fs.readFileSync('./databases/censored.json'))
      const found = censored.find(c => c.word === word)
      if (!found)
        return await interaction.reply({
          content: 'This word is not censored!',
          ephemeral: true
        })
      const index = censored.indexOf(found)
      censored.splice(index, 1)
      fs.writeFileSync('./databases/censored.json', JSON.stringify(censored))
      await interaction.reply({
        content: `Removed censor for the word ${word}!`,
        ephemeral: true
      })
    } else if (interaction.options.getSubcommand() === 'list') {
      const censored = JSON.parse(fs.readFileSync('./databases/censored.json'))
      await interaction.reply({
        embeds: [
          {
            title: 'Censored words',
            color: accent,
            fields: censored.map(c => ({
              name: c.word,
              value: `Added by <@${c.user}>`
            }))
          }
        ],
        ephemeral: true
      })
    } else return interaction.reply('Invalid option.')
  }
}
