module.exports = async (guild, target, type, info) => {
  const {
    customization: { accent, colors },
    channels: { logs }
  } = require('../config.json')
  const template = {
    title: '',
    fields: [
      {
        name: 'Reason',
        value: info.reason || 'N/A'
      },
      {
        name: 'Moderator',
        value: `<@${info.moderator?.id}>`
      }
    ]
  }
  const types = {
    ban: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `You have been banned in ${guild.name}!`
      embed.color = colors.bad || '#f45450'
      return embed
    },
    kick: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `You have been kicked from ${guild.name}!`
      embed.color = colors.bad || '#f45450'
      return embed
    },
    timeout: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `You have been timed out in ${guild.name}!`
      embed.color = colors.medium || '#fdbc40'
      embed.fields.splice(1, 0, {
        name: 'Duration',
        value: info.duration
      })
      return embed
    },
    untimeout: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `Your timeout has been removed in ${guild.name}!`
      embed.color = colors.good || '#36c84b'
      return embed
    }
  }
  const embed = types[type]
  if (!embed) return
  const dm = await target.send({ embeds: [embed()] }).catch(() => null)
  return dm !== null ? true : false
}
