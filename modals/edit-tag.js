const fs = require('fs')

if (!fs.existsSync('./databases/tags.json')) fs.writeFileSync('./databases/tags.json', '{}')

module.exports = {
  id: 'edit-tag',
  async execute(interaction) {
    const tags = JSON.parse(fs.readFileSync('./databases/tags.json', 'utf-8'))
    const name = interaction.fields.fields.find(f => f.customId === 'name').value
    const content = interaction.fields.fields.find(f => f.customId === 'content').value
    const image = interaction.fields.fields.find(f => f.customId === 'image').value
    if (!tags[name]) return interaction.reply({ content: `A tag with the name ${name} does not exist.`, ephemeral: true })

    tags[name] = {
      content,
      image
    }
    fs.writeFileSync('./databases/tags.json', JSON.stringify(tags, null, 4))
    interaction.reply({ content: `Edited tag ${name}.`, ephemeral: true })
  }
}
