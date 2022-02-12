const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const triggers = require('../triggers.json')
const config = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('trigger')
		.setDescription('Configure triggers')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a trigger')
				.addStringOption(option => option.setName('trigger').setDescription('The word the bot should respond to').setRequired(true))
				.addStringOption(option => option.setName('response').setDescription('Response for the trigger word').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a trigger')
				.addStringOption(option => option.setName('trigger').setDescription('The trigger word to remove').setRequired(true))
		),
	async execute(interaction) {
		const trigger = interaction.options.getString('trigger');
		const response = interaction.options.getString('response');
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
		if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');

		if (interaction.options.getSubcommand() === "add") {
			for (i in triggers) {
				if (triggers[i].trigger === trigger) return interaction.reply('That trigger already exists!')
			}
			fs.readFile('triggers.json', function readFile(err, data) {
				if (err) return console.log(`ERROR: ${err}`)
				var obj = JSON.parse(data)
				obj.push({
					"trigger": trigger,
					"response": response
				})
				json = JSON.stringify(obj)
				fs.writeFileSync('triggers.json', json)
			})
			return interaction.reply(`Added trigger "${trigger}" with response "${response}"!`)

		} else if (interaction.options.getSubcommand() === "remove") {
			for (i in triggers) {
				if (triggers[i].trigger === trigger) {
					fs.readFile('triggers.json', function readFile(err, data) {
						if (err) return console.log(`ERROR: ${err}`)
						var obj = JSON.parse(data)
						obj.splice(i)
						json = JSON.stringify(obj)
						fs.writeFileSync('triggers.json', json)
					})
					return interaction.reply(`Removed trigger "${trigger}"!`)
				}
			}
			return interaction.reply('That trigger does not exist!')

		} else return interaction.reply("Invalid option.")
	},
};
