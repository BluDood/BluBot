const { SlashCommandBuilder } = require('discord.js')
const config = require('../utils/config')
const { default: axios } = require('axios')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('define')
    .setDescription('Define a word with Urban Dictionary!')
    .addStringOption(option => option.setName('query').setDescription('Word to search for').setRequired(true)),
  async execute(interaction) {
    // https://guides.bludood.com/apis/urban-dictionary-api
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
      color: config.getColor('accent'),
      title: res.data.result[0].word,
      description: res.data.result[0].description
    }
    return interaction.editReply({ embeds: [embed] })
  }
}
