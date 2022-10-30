const { SlashCommandBuilder } = require('@discordjs/builders')
const {
  customization: { accent }
} = require('../config.json')
const checkUserPerms = require('../utils/checkUserPerms')

module.exports = {
  data: new SlashCommandBuilder().setName('check').setDescription('Check if are allowed to moderate using this bot.'),
  async execute(interaction) {
    if (checkUserPerms(interaction))
      return interaction.reply({
        embeds: [
          {
            title: `You are allowed to moderate using this bot!`,
            color: accent
          }
        ]
      })
    return interaction.reply({
      embeds: [
        {
          title: `You are not allowed to moderate using this bot.`,
          color: accent
        }
      ]
    })
  }
}
