const { Events } = require('discord.js')
const reactionroles = require('../utils/reactionroles')

module.exports = {
  event: Events.MessageReactionRemove,
  async listener(event, user) {
    const found = reactionroles.get(event.emoji.id || event.emoji.name, event.message.id)
    if (found) {
      const member = await event.message.guild.members.fetch(user.id)
      if (member) member.roles.remove(found.role)
    }
  }
}
