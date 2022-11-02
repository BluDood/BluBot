const { AuditLogEvent, Events } = require('discord.js')
const fs = require('fs')
const log = require('../utils/log')
const sleep = require('../utils/sleep')

module.exports = {
  event: Events.MessageDelete,
  async listener(message) {
    if (!message.guild) return
    await sleep(1000)
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete
    })
    const deletionLog = fetchedLogs.entries.first()
    const { executor, target } = deletionLog || {}
    if (target?.id === message.author.id && deletionLog.createdAt > message.createdAt)
      log(message.guild, 'messageDelete', {
        moderator: {
          id: executor.id
        },
        content: message.content,
        channel: {
          id: message.channel.id
        },
        target: {
          id: message.author.id
        }
      })
    else
      log(message.guild, 'messageDelete', {
        content: message.content,
        channel: {
          id: message.channel.id
        },
        target: {
          id: message.author.id
        }
      })
  }
}
