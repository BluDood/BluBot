const fs = require('fs')

module.exports = {
  id: 'tag',
  async execute(interaction) {
    // Auto complete the tag command
    if (interaction.options.getSubcommand() === 'remove' || interaction.options.getSubcommand() === 'get') {
      const tags = JSON.parse(fs.readFileSync('./databases/tags.json'))
      let tagNames = Object.keys(tags)
      tagNames = tagNames.filter(name => name.startsWith(interaction.options.getFocused()))
      return interaction.respond(tagNames.map(tag => ({ name: tag, value: tag })))
    }
  }
}
