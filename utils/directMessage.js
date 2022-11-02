const config = require('./config')

module.exports = async (guild, target, type, info) => {
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
      embed.color = config.getColor('bad')
      return embed
    },
    kick: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `You have been kicked from ${guild.name}!`
      embed.color = config.getColor('bad')
      return embed
    },
    timeout: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `You have been timed out in ${guild.name}!`
      embed.color = config.getColor('medium')
      embed.fields.splice(1, 0, {
        name: 'Duration',
        value: info.duration
      })
      return embed
    },
    untimeout: () => {
      const embed = JSON.parse(JSON.stringify(template))
      embed.title = `Your timeout has been removed in ${guild.name}!`
      embed.color = config.getColor('good')
      return embed
    }
  }
  const embed = types[type]
  if (!embed) return
  const dm = await target.send({ embeds: [embed()] }).catch(() => null)
  return dm !== null ? true : false
}
