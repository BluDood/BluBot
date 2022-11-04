const tag = require('../utils/tag')

module.exports = {
  id: 'add-tag',
  async execute(interaction) {
    const name = interaction.fields.fields.find(f => f.customId === 'name').value
    const content = interaction.fields.fields.find(f => f.customId === 'content').value
    const image = interaction.fields.fields.find(f => f.customId === 'image').value
    if (tag.get(name)) return interaction.reply({ content: `A tag with the name ${name} already exists.`, ephemeral: true })

    tag.add(name, content, image)
    interaction.reply({ content: `Added tag ${name}.`, ephemeral: true })
  }
}
