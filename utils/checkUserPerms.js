const { PermissionFlagsBits } = require('discord.js')
const { modRoles } = require('../config.json')
module.exports = interaction => {
  const roles = interaction.member.roles.cache.map(r => r.id)
  if (roles.some(id => modRoles.includes(parseInt(id))) || interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return true
  return false
}
