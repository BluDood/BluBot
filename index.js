const fs = require('fs');
const { Client, Collection, Intents, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./config.json');
const axios = require('axios')
const deployCommands = require('./deploy-commands')

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
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

client.on('invalidRequestWarning', error => {
	console.error(error);
})

client.on('messageDelete', async message => {
	if (fs.readFileSync('deleted.txt', 'utf-8') === 'true') {
		return fs.writeFileSync('deleted.txt', 'false', 'utf-8')
	}
	if (!message.guild) return;
	const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	const { executor, target } = deletionLog;
	if (target.id === message.author.id) {
		var embed = {
			color: "#ff4545",
			title: `Message deleted by moderator`,
			fields: [
				{
					"name": "Username",
					"value": message.author.tag || 'Unknown'
				},
				{
					"name": "ID",
					"value": message.author.id || 'Unknown'
				},
				{
					"name": "Message",
					"value": message.content || 'Unknown'
				},
				{
					"name": "Channel",
					"value": `<#${message.channel.id}>` || 'Unknown'
				},
				{
					"name": "Responsible Moderator",
					"value": executor.tag || 'Unknown'
				},
				{
					"name": "Time",
					"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
				}
			]
		};;
	} else {
		var embed = {
			color: "#ff4545",
			title: `Message deleted by user`,
			fields: [
				{
					"name": "Username",
					"value": message.author.tag || 'Unknown'
				},
				{
					"name": "ID",
					"value": message.author.id || 'Unknown'
				},
				{
					"name": "Message",
					"value": message.content || 'Unknown'
				},
				{
					"name": "Channel",
					"value": `<#${message.channel.id}>` || 'Unknown'
				},
				{
					"name": "Time",
					"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
				}
			]
		};
	}
	
	message.guild.channels.cache.get(config.channels.logs).send({ embeds: [embed] })
})

// message action
client.on('messageCreate', async message => {
	if (message.author.bot) return

	// Phishing links
	if (String(message.content).includes('http://') || String(message.content).includes('https://')) {
		if (String(message.content).includes('http://')) {
			var site = String(message.content).split('http://').pop().split('/').shift()
		}
		else {
			var site = String(message.content).split('https://').pop().split('/').shift()
		}
		const res = await axios.get(`https://phish.sinking.yachts/v2/check/${site}`)
		if (res.data === true) {
			fs.writeFileSync('deleted.txt', 'true', 'utf-8')
			message.delete()
			const embed = {
				color: "#ff4545",
				title: 'Harmful site detected!',
				description: "This message has been hidden and reported to the staff team.",
				fields: [
					{
						"name": "Username",
						"value": message.author.tag || 'Unknown'
					},
					{
						"name": "Time",
						"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
					}
				],
				footer: {
					"icon_url": client.user.avatarURL(),
					"text": "Powered by phish.sinking.yachts!"
				}
			};
			message.channel.send({embeds: [embed]})
			const logembed = {
				color: "#ff4545",
				title: `Harmful site detected by ${message.author.username}!`,
				fields: [
					{
						"name": "Username",
						"value": message.author.tag || 'Unknown'
					},
					{
						"name": "ID",
						"value": message.author.id || 'Unknown'
					},
					{
						"name": "Message",
						"value": message.content || 'Unknown'
					},
					{
						"name": "Channel",
						"value": `<#${message.channel.id}>` || 'Unknown'
					},
					{
						"name": "Harmful Site",
						"value": site || 'Unknown'
					},
					{
						"name": "Time",
						"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
					}
				]
			};
			message.guild.channels.cache.get(config.channels.logs).send({embeds: [logembed]})
		}
	}

	// Censors
	const censored = JSON.parse(fs.readFileSync('./censored.json'))
	for (i in censored) {
		if (message.content.includes(censored[i])) {
			fs.writeFileSync('deleted.txt', 'true', 'utf-8')
			const embed = {
				color: "#ff8000",
				title: `Deleted message with censored word from ${message.author.username}`,
				fields: [
					{
						"name": "Username",
						"value": message.author.tag || 'Unknown'
					},
					{
						"name": "ID",
						"value": message.author.id || 'Unknown'
					},
					{
						"name": "Message",
						"value": message.content || 'Unknown'
					},
					{
						"name": "Censored Word",
						"value": censored[i] || 'Unknown'
					},
					{
						"name": "Channel",
						"value": `<#${message.channel.id}>` || 'Unknown'
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

	// Triggers
	const triggers = JSON.parse(fs.readFileSync('./triggers.json'))
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
