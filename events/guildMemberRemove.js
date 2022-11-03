const { Events } = require('discord.js')
const config = require('../utils/config')

module.exports = {
  event: Events.GuildMemberRemove,
  async listener(event) {
    if (!config.get().channels.welcome) return
    const channel = await event.guild.channels.fetch(config.get().channels.welcome)
    if (!channel) return
    channel.send(`Goodbye <@${event.user.id}> 👋`)
  }
}
