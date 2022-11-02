const { PermissionFlagsBits } = require('discord.js')
const config = require('./config')
const { modRoles } = config.get()

module.exports = interaction => {
  const roles = interaction.member.roles.cache.map(r => r.id)
  if (roles.some(id => modRoles.includes(id)) || interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return true
  return false
}
