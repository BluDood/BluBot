const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const fs = require('fs')
const deploy = require('./utils/deploy')
const bconsole = require('./console')
const { cacheAll } = require('./utils/reactionroles')

if (!fs.existsSync('./config.json')) {
  console.log("Looks like you haven't set up the bot yet! Please run 'npm run setup' and try again.")
  process.exit()
}

if (!fs.existsSync('./databases')) fs.mkdirSync('./databases')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]
})

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

bconsole.init(process.argv[2])
client.once(Events.ClientReady, async c => {
  bconsole.motd(c.user.tag)
  deploy(c.user.id)
  cacheAll(client)
})

for (const eventFile of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
  const event = require(`./events/${eventFile}`)
  client.on(event.event, event.listener)
}

for (const autoCompleteFile of fs.readdirSync('./autocomplete').filter(file => file.endsWith('.js'))) {
  const autoComplete = require(`./autocomplete/${autoCompleteFile}`)
  client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== autoComplete.id) return;
    autoComplete.execute(interaction)
  })
}

client.on(Events.Error, error => {
  console.log(error)
})

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) return;
  if (interaction.isAutocomplete()) return;
  const command = client.commands.get(interaction.commandName)
  if (command) {
    try {
      await command.execute(interaction)
    } catch (error) {
      console.error(error)
    }
  }
})

const { token } = require('./config.json')
client.login(token)
