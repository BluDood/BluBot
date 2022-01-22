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
	if (censored.some(r => message.content.split(" ").includes(r))) {
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

	triggers.forEach(trigger => {

		const words = message.content.split(" ")
		words.forEach(msg => {
			if (msg.toLowerCase() == trigger.trigger) {
				message.reply(trigger.response)
			}
		});
	});

	if (message.content.startsWith("[[") && message.content.includes("]]")) {
		var tweak = String(message.content).replace("[[", "").split("]]")[0]
		var page = String(message.content).replace("[[", "").split("]] ")[1] || 1
		async function getData() {
			const data = await fetch(`https://api.parcility.co/db/search?q=${tweak}`)
			return data.json()
		}
		var data = await getData()
		if (data.status === false) return message.reply("Error in finding tweak. Are you sure you spelled it correctly?")
		var items = data.data.length
		var currentPage = data.data[page - 1]
		if (page <= 0) return message.reply("Invalid page number.")
		if (page > items) return message.reply("Could not find that page!")
		if (String(currentPage.Icon).includes("file:")) {
			var icon = currentPage.repo.icon
		} else {
			var icon = currentPage.Icon
		}
		const embed = {
			color: "#0064FF",
			title: `Tweak Search for ${tweak} | Page ${page}`,
			thumbnail: {
				url: icon
			},
			fields: [
				{
					"name": "Name",
					"value": currentPage.Name
				},
				{
					"name": "Author",
					"value": currentPage.Author
				},
				{
					"name": "Repo",
					"value": currentPage.repo.url
				}
			],
			footer: {
				text: `Page ${page}/${items} | Switch pages with [[${tweak}]] <number>\nPowered by Parcility`,
			},
		};
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setURL(currentPage.repo.url)
					.setLabel('Repo')
					.setStyle('LINK'),
			);
		message.reply({ embeds: [embed], components: [buttons] })
	}
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
