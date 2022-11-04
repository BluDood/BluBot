const tag = require('../utils/tag')

module.exports = {
  id: 'tag',
  async execute(interaction) {
    if (!['remove', 'get', 'edit'].includes(interaction.options.getSubcommand())) return
    const tags = tag.getAll()
    const tagNames = Object.keys(tags).filter(name => name.includes(interaction.options.getFocused()))
    return interaction.respond(tagNames.map(tag => ({ name: tag, value: tag })))
  }
}
