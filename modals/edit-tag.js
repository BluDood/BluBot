const tag = require('../utils/tag')

module.exports = {
  id: 'edit-tag',
  async execute(interaction) {
    const name = interaction.fields.fields.find(f => f.customId === 'name').value
    const content = interaction.fields.fields.find(f => f.customId === 'content').value
    const image = interaction.fields.fields.find(f => f.customId === 'image').value
    if (!tag.get(name)) return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })

    tag.modify(name, content, image)
    interaction.reply({ content: `Edited tag ${name}.`, ephemeral: true })
  }
}
