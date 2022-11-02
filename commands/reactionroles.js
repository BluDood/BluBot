const { SlashCommandBuilder, resolveColor } = require('discord.js')
const reactionroles = require('../utils/reactionroles')
const checkUserPerms = require('../utils/checkUserPerms')
const config = require('../utils/config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionroles')
    .setDescription('Manage reaction roles')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a reaction role')
        .addRoleOption(option => option.setName('role').setDescription('Role to add').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('Emoji reaction').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Link to message').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a reaction role')
        .addStringOption(option => option.setName('emoji').setDescription('Emoji reaction').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Link to message').setRequired(true))
    )
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List current reaction roles')),
  async execute(interaction) {
    if (!checkUserPerms(interaction))
      return interaction.reply({
        content: 'You do not have permission to do that!',
        ephemeral: true
      })
    const role = interaction.options.getRole('role')
    const emoji =
      interaction.options
        .getString('emoji')
        ?.split(':')
        .pop()
        .match(/[0-9]+/)?.[0] || interaction.options.getString('emoji')
    const [guildId, channelId, messageId] =
      interaction.options
        .getString('message')
        ?.match(/[0-9]+\/[0-9]+\/[0-9]+/)?.[0]
        .split('/') || []
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === 'add') {
      if (!channelId || !messageId || !emoji)
        return interaction.reply({
          content: 'Invalid input',
          ephemeral: true
        })
      const found = reactionroles.get(emoji, messageId)
      if (found)
        return interaction.reply({
          content: 'That message and emoji combo already has a reaction role!',
          ephemeral: true
        })
      reactionroles.add(emoji, messageId, role.id, channelId, interaction.options.getString('emoji'))
      return interaction.reply({
        content: `Added reaction role with emoji ${interaction.options.getString('emoji')}, [this message](${interaction.options.getString('message')}) and role <@&${role.id}>`,
        ephemeral: true
      })
    } else if (subcommand === 'remove') {
      if (!messageId || !emoji)
        return interaction.reply({
          content: 'Invalid input',
          ephemeral: true
        })
      const found = reactionroles.get(emoji, messageId)
      if (!found)
        return interaction.reply({
          content: 'That reaction role does not exist!',
          ephemeral: true
        })
      reactionroles.remove(emoji, messageId)
      return interaction.reply({
        content: `Removed reaction role with emoji ${interaction.options.getString('emoji')} from [this message](${interaction.options.getString('message')})`,
        ephemeral: true
      })
    } else if (subcommand === 'list') {
      const roles = reactionroles.getAll()
      const embed = {
        title: `Reaction roles in ${interaction.guild.name}`,
        color: config.getColor('accent'),
        description: roles
          .map(r => `[Jump to Message](https://discord.com/channels/${interaction.guild.id}/${r.channelId}/${r.id})\n${r.roles.map(ro => `${ro.emojiName}: <@&${ro.role}>`).join('\n')}`)
          .join('\n\n')
      }
      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      })
    }
  }
}
