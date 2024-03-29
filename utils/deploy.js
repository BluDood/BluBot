const fs = require('fs')
const crypto = require('crypto')
const { Routes, REST } = require('discord.js')
const sleep = require('./sleep')
const config = require('./config')
const { guildId, token } = config.get()

module.exports = id => {
  const commands = []
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`)
    commands.push(command.data.toJSON())
  }

  const commandsHash = crypto.createHash('sha256').update(JSON.stringify(commands)).digest('hex')
  if (!fs.existsSync('./databases/commandsHash.txt')) fs.writeFileSync('./databases/commandsHash.txt', '')
  if (fs.readFileSync('./databases/commandsHash.txt', 'utf-8') === commandsHash) return
  fs.writeFileSync('./databases/commandsHash.txt', commandsHash)

  const rest = new REST({ version: '9' }).setToken(token)

  rest
    .put(Routes.applicationGuildCommands(id, guildId), { body: commands })
    .then(() => sleep(1000).then(() => console.log('Successfully updated guild commands.')))
    .catch(console.error)
}
