const { SlashCommandBuilder } = require('discord.js')
const {
  customization: { accent }
} = require('../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Get your or another user's avatar")
    .addUserOption(option => option.setName('target').setDescription('User to show avatar for')),
  async execute(interaction) {
    const user = interaction.options.getUser('target') || interaction.user
    const avatar = format => user.avatarURL({ format })
    interaction.reply({
      embeds: [
        {
          title: `${user.username}'s avatar`,
          description: `Download as [png](${avatar('png')}), [jpeg](${avatar('jpeg')}) or [webp](${avatar('webp')}).`,
          color: accent,
          image: {
            url: avatar('png')
          }
        }
      ]
    })
  }
}
