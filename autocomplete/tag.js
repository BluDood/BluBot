const fs = require('fs')

module.exports = {
  id: 'tag',
  async execute(interaction) {
    if (interaction.options.getSubcommand() !== 'remove' && interaction.options.getSubcommand() !== 'get') return
    const tags = JSON.parse(fs.readFileSync('./databases/tags.json'))
    const tagNames = Object.keys(tags).filter(name => name.startsWith(interaction.options.getFocused()))
    return interaction.respond(tagNames.map(tag => ({ name: tag, value: tag })))
  }
}
