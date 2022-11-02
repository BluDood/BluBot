const { Client, Collection, GatewayIntentBits, Events } = require('discord.js')
const fs = require('fs')
const deploy = require('./utils/deploy')
const bconsole = require('./console')
const { cacheAll } = require('./utils/reactionroles')
const config = require('./utils/config')
const { token } = config.get()

if (!fs.existsSync('./databases')) fs.mkdirSync('./databases')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]
})

client.commands = new Collection()
client.modals = new Collection()
client.autoComplete = new Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const modalFiles = fs.readdirSync('./modals').filter(file => file.endsWith('.js'))
const autoCompleteFiles = fs.readdirSync('./autocomplete').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

for (const file of modalFiles) {
  const modal = require(`./modals/${file}`)
  client.modals.set(modal.id, modal)
}

for (const file of autoCompleteFiles) {
  const autoComplete = require(`./autocomplete/${file}`)
  client.autoComplete.set(autoComplete.id, autoComplete)
}

for (const eventFile of fs.readdirSync('./events').filter(file => file.endsWith('.js'))) {
  const event = require(`./events/${eventFile}`)
  client.on(event.event, event.listener)
}

bconsole.init(process.argv[2])
client.once(Events.ClientReady, async c => {
  bconsole.motd(c.user.tag)
  deploy(c.user.id)
  cacheAll(client)
})

client.on(Events.Error, error => {
  console.log(error)
})

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName)
    if (command) await command.execute(interaction).catch(console.error)
  } else if (interaction.isModalSubmit()) {
    const modal = client.modals.get(interaction.customId)
    if (modal) await modal.execute(interaction).catch(console.error)
  } else if (interaction.isAutocomplete()) {
    const autoComplete = client.autoComplete.get(interaction.commandName)
    if (autoComplete) await autoComplete.execute(interaction).catch(console.error)
  }
})

client.login(token)
