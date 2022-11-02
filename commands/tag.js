const { SlashCommandBuilder, resolveColor } = require('discord.js')
const fs = require('fs')
const checkUserPerms = require('../utils/checkUserPerms')
const {
  customization: { accent }
} = require('../config.json')

if (!fs.existsSync('./databases/tags.json')) fs.writeFileSync('./databases/tags.json', '{}')
const tags = JSON.parse(fs.readFileSync('./databases/tags.json'))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Manage tags')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a tag')
        .addStringOption(option => option.setName('name').setDescription('The name of the tag').setRequired(true))
        .addStringOption(option => option.setName('content').setDescription('The content of the tag').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a tag')
        .addStringOption(option => option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true))
    )
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List all tags'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('get')
        .setDescription('Get a tag')
        .addStringOption(option => option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true))
        .addUserOption(option => option.setName('mention').setDescription('User to mention'))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a tag')
        .addStringOption(option => option.setName('name').setDescription('The name of the tag').setRequired(true))
        .addStringOption(option => option.setName('content').setDescription('The new content of the tag').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === 'add') {
      if (!checkUserPerms(interaction)) {
        return interaction.reply({
          content: 'You do not have permission to do that!',
          ephemeral: true
        })
      }
      const name = interaction.options.getString('name')
      const content = interaction.options.getString('content')
      if (tags[name]) return interaction.reply({ content: `A tag with the name ${name} already exists.`, ephemeral: true })

      tags[name] = content
      fs.writeFileSync('./databases/tags.json', JSON.stringify(tags, null, 4))
      interaction.reply({ content: `Added tag ${name}.`, ephemeral: true })
    } else if (subcommand === 'remove') {
      if (!checkUserPerms(interaction)) {
        return interaction.reply({
          content: "Just don't use that tag then ¯\\_(ツ)_/¯ (You don't have permission to do that.)",
          ephemeral: true
        })
      }
      const name = interaction.options.getString('name')
      if (!tags[name]) return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })

      delete tags[name]
      fs.writeFileSync('./databases/tags.json', JSON.stringify(tags, null, 4))
      interaction.reply({ content: `Removed tag ${name}.`, ephemeral: true })
    } else if (subcommand === 'list') {
      const tagList = Object.keys(tags)
      if (tagList.length === 0) return interaction.reply({ content: 'There are no tags.', ephemeral: true })

      const embed = {
        title: `Tags in ${interaction.guild.name}`,
        description: `**${tagList.join('\n')}**`,
        color: resolveColor(accent),
        footer: {
          text: `${tagList.length} tag${tagList.length === 1 ? '' : 's'}`
        }
      }
      interaction.reply({ embeds: [embed], ephemeral: true })
    } else if (subcommand === 'get') {
      const name = interaction.options.getString('name')
      const user = interaction.options.getUser('mention')
      if (!tags[name]) {
        // Shhhh, you didn't see anything.
        // i certainly did not ;)
        if (name === 'sbeve is amazing') return interaction.reply({ content: 'I know, right!', ephemeral: true })

        return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })
      }
      const embed = {
        title: name,
        description: tags[name],
        color: resolveColor(accent)
      }
      user ? interaction.reply({ content: `<@${user.id}>, take a look at this!`, embeds: [embed] }) : interaction.reply({ embeds: [embed] })
    } else if (subcommand === 'edit') {
      if (!checkUserPerms(interaction)) {
        return interaction.reply({
          content: 'You do not have permission to do that!',
          ephemeral: true
        })
      }
      const name = interaction.options.getString('name')
      const content = interaction.options.getString('content')
      if (!tags[name]) return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })

      tags[name] = content
      fs.writeFileSync('./databases/tags.json', JSON.stringify(tags, null, 4))
      interaction.reply({ content: `Edited tag ${name}.`, ephemeral: true })
    }
  }
}
