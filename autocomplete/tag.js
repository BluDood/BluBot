const tag = require('../utils/tag')

module.exports = {
  id: 'tag',
  async execute(interaction) {
    if (!['remove', 'get', 'edit'].includes(interaction.options.getSubcommand())) return
    const tags = tag.getAll()
    const tagNames = Object.keys(tags).filter(name => name.toLowerCase().includes(interaction.options.getFocused().toLowerCase()))
    return interaction.respond(tagNames.map(tag => ({ name: tag, value: tag })))
  }
}
