const fs = require('fs');
const { Client, Collection, Intents, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const fetch = require('node-fetch')
const triggers = require("./triggers.json")
const censored = require('./censored.json')
const deployCommands = require('./deploy-commands')

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// On Ready
client.once('ready', async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	client.user.setActivity(config.server_name, { type: 'WATCHING' })

	// Setup slash commands
	deployCommands();
});

client.on('unhandledRejection', error => {
	console.log(error);
});

client.on('shardError', error => {
	console.error(error);
});

client.on('error', error => {
	console.error(error);
});

// message action
client.on('messageCreate', async message => {
	if (message.author.bot) return
	for (i in censored) {
		if (message.content.includes(censored[i])) {
		const embed = {
			color: "#ff8000",
			title: `Deleted message with censored word from ${message.author.username}`,
			fields: [
				{
					"name": "Username",
					"value": message.author.tag
				},
				{
					"name": "ID",
					"value": message.author.id
				},
				{
					"name": "Message",
					"value": message.content
				},
				{
					"name": "Time",
					"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
				}
			]
		};
		message.guild.channels.cache.get(config.channels.logs).send({ embeds: [embed] })
		return message.delete();
		}
	}

	triggers.forEach(trigger => {
		if (message.content.includes(trigger.trigger)) {
			message.reply(trigger.response)
		}
	});

});

// Events
client.on('interactionCreate', async interaction => {
	const command = client.commands.get(interaction.commandName);
	if (command) {
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});

client.login(config.token);
