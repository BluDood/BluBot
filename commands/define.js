const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')
const axios = require('axios').default

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Define a word with Urban Dictionary!')
    .addStringOption(option => option.setName('query').setDescription('Word to search for').setRequired(true)),
  async execute(interaction) {
    // my api ;)
    const api = 'https://urbanapi.up.railway.app'
    const query = interaction.options.getString('query')
    interaction.deferReply()
    const res = await axios
      .get(`${api}/define/${query}`, {
        validateStatus: false
      })
      .catch(() => null)
    if (!res?.data?.success) return interaction.editReply('An error has occured!')
    if (res.status === 404) return interaction.editReply('Could not find that word!')
    const embed = {
      color: accent,
      title: res.data.result[0].word,
      description: res.data.result[0].description
    }
    return interaction.editReply({ embeds: [embed] })
  }
}
