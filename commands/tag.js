const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js')
const fs = require('fs')
const checkUserPerms = require('../utils/checkUserPerms')
const config = require('../utils/config')

if (!fs.existsSync('./databases/tags.json')) fs.writeFileSync('./databases/tags.json', '{}')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Manage tags')
    .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a tag'))
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
        .addStringOption(option => option.setName('name').setDescription('The name of the tag').setRequired(true).setAutocomplete(true))
    ),

  async execute(interaction) {
    const tags = JSON.parse(fs.readFileSync('./databases/tags.json', 'utf-8'))

    const subcommand = interaction.options.getSubcommand()
    if (subcommand === 'add') {
      if (!checkUserPerms(interaction)) {
        return interaction.reply({
          content: 'You do not have permission to do that!',
          ephemeral: true
        })
      }

      const modal = new ModalBuilder().setTitle('Add a tag').setCustomId('add-tag')

      const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setPlaceholder('Name')
        .setLabel('Name')
        .setMinLength(1)
        .setMaxLength(32)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)

      const contentInput = new TextInputBuilder()
        .setCustomId('content')
        .setPlaceholder('Content')
        .setLabel('Content')
        .setMinLength(1)
        .setMaxLength(2000)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)

      const imageInput = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('Image')
        .setPlaceholder('Image URL')
        .setMinLength(1)
        .setMaxLength(2000)
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

      modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(contentInput), new ActionRowBuilder().addComponents(imageInput))

      await interaction.showModal(modal)
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
        color: config.getColor('accent'),
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
        // Sorry for changing this again the lack of the question mark was really getting to me!
        // might add my own one too then :)
        if (name === 'sbeve is amazing') return interaction.reply({ content: 'I know, right?!', ephemeral: true })
        if (name === 'bludood is the best') return interaction.reply({ content: 'very true', ephemeral: true })

        return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })
      }
      const embed = {
        title: name,
        description: tags[name].content,
        color: config.getColor('accent'),
        image: {
          url: tags[name].image
        }
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
      if (!tags[name]) return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })

      const modal = new ModalBuilder().setTitle('Edit a tag').setCustomId('edit-tag')

      const nameInput = new TextInputBuilder()
        .setCustomId('name')
        .setPlaceholder('Name')
        .setLabel('Name')
        .setMinLength(1)
        .setMaxLength(32)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setValue(name)

      const contentInput = new TextInputBuilder()
        .setCustomId('content')
        .setPlaceholder('Content')
        .setLabel('Content')
        .setMinLength(1)
        .setMaxLength(2000)
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(tags[name].content)

      const imageInput = new TextInputBuilder()
        .setCustomId('image')
        .setLabel('New image')
        .setPlaceholder('New image URL')
        .setMinLength(1)
        .setMaxLength(2000)
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setValue(tags[name].image)

      modal.addComponents(new ActionRowBuilder().addComponents(nameInput), new ActionRowBuilder().addComponents(contentInput), new ActionRowBuilder().addComponents(imageInput))

      await interaction.showModal(modal)
    }
  }
}
