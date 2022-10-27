module.exports = (guild, type, info) => {
  const {
    customization: { accent, colors },
    channels: { logs }
  } = require('../config.json')
  const templates = {
    moderate: {
      title: '',
      fields: [
        {
          name: 'User',
          value: `<@${info.target?.id}>`
        },
        {
          name: 'Reason',
          value: info.reason || 'N/A'
        },
        {
          name: 'Responsible Moderator',
          value: `<@${info.moderator?.id}>`
        },
        {
          name: 'Time',
          value: `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(
            Date.now() / 1000
          )}:R>`
        }
      ]
    },
    channel: {
      title: '',
      fields: [
        {
          name: 'Channel',
          value: `<#${info.channel?.id}>`
        },
        {
          name: 'Responsible Moderator',
          value: `<@${info.moderator?.id}>`
        },
        {
          name: 'Time',
          value: `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(
            Date.now() / 1000
          )}:R>`
        }
      ]
    },
    message: {
      title: '',
      fields: [
        {
          name: 'User',
          value: `<@${info.target?.id}>`
        },
        {
          name: 'Message',
          value: info.content
        },
        {
          name: 'Channel',
          value: `<#${info.channel?.id}>`
        },
        {
          name: 'Time',
          value: `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(
            Date.now() / 1000
          )}:R>`
        }
      ]
    }
  }
  const types = {
    ban: () => {
      const embed = JSON.parse(JSON.stringify(templates.moderate))
      embed.title = `Banned ${info.target.tag}`
      embed.color = colors.bad || '#f45450'
      return embed
    },
    unban: () => {
      const embed = JSON.parse(JSON.stringify(templates.moderate))
      embed.title = `Unbanned ${info.target.tag}`
      embed.color = colors.good || '#36c84b'
      return embed
    },
    kick: () => {
      const embed = JSON.parse(JSON.stringify(templates.moderate))
      embed.title = `Kicked ${info.target.tag}`
      embed.color = colors.bad || '#f45450'
      return embed
    },
    timeout: () => {
      const embed = JSON.parse(JSON.stringify(templates.moderate))
      embed.title = `Timed out ${info.target.tag}`
      embed.color = colors.medium || '#fdbc40'
      embed.fields.splice(2, 0, {
        name: 'Duration',
        value: `${info.duration}`
      })
      return embed
    },
    untimeout: () => {
      const embed = JSON.parse(JSON.stringify(templates.moderate))
      embed.title = `Removed timeout for ${info.target.tag}`
      embed.color = colors.good || '#36c84b'
      return embed
    },
    messageDelete: () => {
      const embed = JSON.parse(JSON.stringify(templates.message))
      embed.title = `Message deleted by ${
        info.moderator ? 'moderator' : 'user'
      }`
      embed.color = colors.bad || '#f45450'
      if (info.moderator)
        embed.fields.splice(2, 0, {
          name: 'Responsible Moderator',
          value: `<@${info.moderator.id}>`
        })
      return embed
    },
    messageEdit: () => {
      const embed = JSON.parse(JSON.stringify(templates.message))
      embed.title = 'Message edited'
      embed.color = colors.medium || '#fdbc40'
      embed.fields.splice(1, 0, {
        name: 'Old Message',
        value: info.oldMessage
      })
      return embed
    },
    purge: () => {
      const embed = JSON.parse(JSON.stringify(templates.channel))
      embed.title = `Purged ${info.amount} message${
        info.amount === 1 ? '' : 's'
      }${info.target ? ` by ${info.target.tag}` : ''}`
      embed.color = colors.medium || '#fdbc40'
      if (info.target)
        embed.fields.splice(0, 0, {
          name: 'User',
          value: `<@${info.target.id}>`
        })
      return embed
    },
    lock: () => {
      const embed = JSON.parse(JSON.stringify(templates.channel))
      embed.title = `Locked #${info.channel.name}`
      embed.color = colors.medium || '#fdbc40'
      return embed
    },
    unlock: () => {
      const embed = JSON.parse(JSON.stringify(templates.channel))
      embed.title = `Unlocked #${info.channel.name}`
      embed.color = colors.good || '#36c84b'
      return embed
    },
    phish: () => {
      const embed = JSON.parse(JSON.stringify(templates.message))
      embed.title = `Deleted phishing site by ${info.target.tag}`
      embed.color = colors.bad || '#f45450'
      embed.fields.splice(3, 0, {
        name: 'Harmful Site',
        value: info.site
      })
      return embed
    }
  }
  const embed = types[type]
  if (!embed) return
  guild.channels.cache.get(logs).send({ embeds: [embed()] })
}
