const { Events } = require('discord.js')
const fs = require('fs')
const log = require('../utils/log')

module.exports = {
  event: Events.MessageUpdate,
  async listener(oldMessage, newMessage) {
    if (oldMessage.content === newMessage.content) return
    log(newMessage.guild, 'messageEdit', {
      oldMessage: oldMessage.content,
      content: newMessage.content,
      target: {
        id: newMessage.author.id
      },
      channel: {
        id: newMessage.channel.id
      }
    })
  }
}
