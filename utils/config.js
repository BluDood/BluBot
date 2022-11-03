const { resolveColor } = require('discord.js')
const fs = require('fs')

function checkConfig() {
  if (!fs.existsSync('./config.json')) {
    console.log("Looks like you haven't set up the bot yet! Please run 'npm run setup' and try again.")
    process.exit()
  }
  try {
    JSON.parse(fs.readFileSync('./config.json'))
  } catch {
    console.log("Looks like your config file has been corrupted. Please regenerate it with 'npm run setup' and try again.")
    process.exit()
  }
}

function getConfig() {
  checkConfig()
  return JSON.parse(fs.readFileSync('./config.json'))
}

module.exports = {
  check: checkConfig,
  getColor: color => {
    checkConfig()
    const { customization } = getConfig()
    const colors = {
      accent: customization.accent || '#0000FF',
      good: customization.good || '#36c84b',
      medium: customization.medium || '#fdbc40',
      bad: customization.bad || '#f45450'
    }
    const found = colors[color]
    if (!found) return null
    return resolveColor(found)
  },
  get: getConfig
}
