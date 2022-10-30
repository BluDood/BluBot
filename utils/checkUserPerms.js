const { modRoles } = require('../config.json')
module.exports = interaction => {
  const roles = interaction.member.roles.cache.map(r => r.id)
  if (roles.some(id => modRoles.includes(id)) || interaction.member.permissions.has('ADMINISTRATOR')) return true
  return false
}
