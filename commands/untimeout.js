const { SlashCommandBuilder } = require('discord.js')
const config = require('../utils/config')
const checkUserPerms = require('../utils/checkUserPerms')
const directMessage = require('../utils/directMessage')
const log = require('../utils/log')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove the timeout a member.')
    .addUserOption(option => option.setName('target').setDescription('User to remove timeout for').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the timeout removal')),
  async execute(interaction) {
    const target = interaction.options.getUser('target')
    const reason = interaction.options.getString('reason') || 'N/A'
    const member = await interaction.guild.members.fetch({ user: target, force: true }).catch(() => null)
    if (!member)
      return interaction.reply({
        content: "I can't find that user!",
        ephemeral: true
      })
    if (!member.moderatable)
      return interaction.reply({
        content: "I can't remove the timeout for that user!",
        ephemeral: true
      })
    await interaction.reply({
      embeds: [
        {
          title: `Removed timeout for ${target.tag}.`,
          color: config.getColor('accent')
        }
      ],
      ephemeral: true
    })
    const dm = await directMessage(interaction.guild, target, 'untimeout', {
      reason,
      moderator: {
        id: interaction.user.id
      }
    })
    if (!dm)
      await interaction.followUp({
        content: 'I could not message that user!',
        ephemeral: true
      })
    await member.timeout(null, reason)
    log(interaction.guild, 'untimeout', {
      target: {
        id: target.id,
        tag: target.tag
      },
      moderator: {
        id: interaction.user.id
      },
      reason
    })
  }
}
