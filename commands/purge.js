const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs')
const censored = require('../censored.json')
const config = require('../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge messages.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('channel')
				.setDescription('Purge messages by channel')
				.addChannelOption(option => option.setName('channel').setDescription('Channel to purge messages in').setRequired(true))
				.addNumberOption(option => option.setName('amount').setDescription('Amount of messages to purge (max 100)').setRequired(true))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Purge all messages by user (within last 100 sent in this channel)')
				.addUserOption(option => option.setName('user').setDescription('User to purge messages for').setRequired(true))
		),
	async execute(interaction) {
		const amountToPurge = interaction.options.getNumber('amount');
		const channelToPurge = interaction.options.getChannel('channel');
		const userToPurge = interaction.options.getUser('user');
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
		if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');

		if (amountToPurge > 100) return interaction.reply("Max messages to purge is 100! This is a limitation by Discord. You can run this command multiple times to purge more messages.")
		if (interaction.options.getSubcommand() === "channel") {
			channelToPurge.bulkDelete(amountToPurge)
			interaction.reply(`Purged ${amountToPurge} messages in channel ${channelToPurge}!`)
		} else if (interaction.options.getSubcommand() === "user") {
			const messages = interaction.channel.messages.fetch()
			const userMessages = (await messages).filter(
				(m) => m.author.id === userToPurge.id
			)
			if (JSON.stringify(userMessages) === "[]") return interaction.reply("Could not find any messages by that user! (within last 100 messages sent here)")
			await interaction.channel.bulkDelete(userMessages)
			interaction.reply(`Purged all messages by user ${userToPurge}! (within last 100 messages sent here)`)
		} else return interaction.reply("Invalid option.")
	},
};
