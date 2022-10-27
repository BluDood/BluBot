module.exports = interaction => {
  const requiredPerms = [
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'CONNECT',
    'SPEAK',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MODERATE_MEMBERS'
  ]
  const currentPerms = interaction.guild.me.permissions.serialize()
  const missingPerms = requiredPerms.filter(
    perm => currentPerms[perm] === false
  )
  if (missingPerms.length === 0) return true
  return missingPerms
}
