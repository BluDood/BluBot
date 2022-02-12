const { SlashCommandBuilder } = require('@discordjs/builders');
const { GuildMember, Client } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member.')
		.addUserOption(option => option.setName('target').setDescription('User to ban').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for the ban'))
		.addNumberOption(option => option.setName('days').setDescription('Days to delete messages')),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') || "N/A";
		const days = interaction.options.getNumber('days') || 0;
		const member = interaction.guild.members.cache.get(target.id) || await interaction.guild.members.fetch(target.id).catch(err => {})
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
		if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');
		if (member.bannable === false) return interaction.reply("Sorry, I can't ban that user!")
		const embed = {
			color: "#ff4545",
			title: `Banned ${target.username}`,
			fields: [
				{
					"name": "Username",
					"value": target.tag
				},
				{
					"name": "ID",
					"value": target.id
				},
				{
					"name": "Reason",
					"value": reason
				},
				{
					"name": "Responsible Moderator",
					"value": `${interaction.member.user.username}#${interaction.member.user.discriminator}`
				},
				{
					"name": "Time",
					"value": `<t:${Math.floor(Date.now() / 1000)}:f>\n<t:${Math.floor(Date.now() / 1000)}:R>`
				}
			]
		};
		interaction.guild.channels.cache.get(config.channels.logs).send({embeds: [embed]})
		member.ban({ days: days, reason: reason })
		await interaction.reply({ content: `**Banned ${target.username}**\nReason: ${reason}`});
		try {
			return member.send(`You were banned from ${config.server_name}!\nReason: ${reason}`)
		} catch {
			return await interaction.followUp(`I couldn't DM ${target.username}!`)
		}
	},
};