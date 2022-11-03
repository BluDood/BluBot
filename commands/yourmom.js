const { SlashCommandBuilder } = require('discord.js')
const { default: axios } = require('axios')
const config = require('../utils/config')

module.exports = {
  data: new SlashCommandBuilder().setName('yourmom').setDescription("yo momma so phat she couldn't run this command"),
  async execute(interaction) {
    const joke = await axios.get('https://api.yomomma.info').catch(() => null)
    if (joke?.data.joke)
      interaction.reply({
        embeds: [
          {
            title: joke.data.joke,
            color: config.getColor('accent'),
            footer: {
              text: `Powered by api.yomomma.info`
            }
          }
        ]
      })
    else {
      interaction.reply({
        embeds: [
          {
            title: 'Yo momma so phat she rolled over the cables and broke them',
            color: config.getColor('accent'),
            footer: {
              text: 'I was not able to fetch a joke from api.yomomma.info.'
            }
          }
        ]
      })
    }
  }
}
