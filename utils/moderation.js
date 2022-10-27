const log = require('./log')

// unused for now, don't look

async function ban(target, reason, deleteMessages) {
  if (!target.bannable) return 'that user is not bannable!'
  const ban = await target
    .ban(target, { days: deleteMessages, reason: reason })
    .catch(() => false)
  if (ban == false) return 'I could not ban that user!'
  return true
}

async function unban(guild, target, reason) {
  const bans = await guild.bans.fetch()
  if (!bans.has(target.id)) return 'that user is not banned!'
  const unban = await guild.members.unban(target, reason).catch(() => false)
  if (unban == false) return 'an unknown error occurred!'
  return true
}

async function kick(target, reason) {
  if (!target.kickable) return 'that user is not kickable!'
  const kick = await target.kick(reason).catch(() => false)
  if (kick == false) return 'an unknown error occurred!'
  return true
}

async function timeout(target, reason, duration) {
  if (!target.moderatable) return 'that user is not moderatable!'
  const timeout = await target.timeout(duration, reason).catch(() => false)
  if (timeout == false) return 'an unknown error occurred!'
  return true
}

async function untimeout(target, reason) {
  if (!target.moderatable) return 'that user is not moderatable!'
  const untimeout = await target.timeout(null, reason).catch(() => false)
  if (untimeout == false) return 'an unknown error occurred!'
  return true
}

async function purge(channel, amount, reason, target) {
  if (!channel.manageable) return 'that channel is not manageable!'
  let messages = await channel.messages
    .fetch({ limit: amount }, { cache: false, force: true })
    .catch(() => false)
  if (target) messages = messages.filter(m => m.author.id == target.id)
  if (messages == false) return 'an unknown error occurred!'
  if (messages.size == 0) return 'there are no messages to purge!'
  const purge = channel.bulkDelete(messages, reason).catch(() => false)
  if (purge == false) return 'an unknown error occurred!'
  return true
}

module.exports = {
  checkBotPerms: interaction => {
    return require('./checkBotPerms')(interaction)
  },
  checkUserPerms: interaction => {
    return require('./checkUserPerms')(interaction)
  },
  moderate: (moderator, target, reason, type, options) => {
    let = true
    if (type == 'ban') {
      const result = ban(target, reason, options.deleteMessages)
      if (result !== true) su
    } else if (type == 'kick') {
      const result = kick(target, reason)
    } else if (type == 'timeout') {
      const result = timeout(target, reason, options.duration)
    }
    log(moderator.guild, type, {
      moderator,
      reason,
      target
    })
  },
  unmoderate: (moderator, target, reason, type) => {}
}
