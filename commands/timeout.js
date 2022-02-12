const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Time-out a member.')
		.addUserOption(option => option.setName('target').setDescription('User to timeout').setRequired(true))
		.addNumberOption(option => option.setName('duration').setDescription('Duration for the timeout in days').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for the timeout')),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const duration = (interaction.options.getNumber('duration') * 1000 * 60 * 60 * 24);
		const reason = interaction.options.getString('reason') || "N/A";
		const member = interaction.guild.members.cache.get(target.id) || await interaction.guild.members.fetch(target.id).catch(err => { })
		const timeoutUntil = new Date(new Date().getTime() + duration).toISOString()
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
		if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');
		if (member.moderatable == false) return interaction.reply("Sorry, I can't timeout that user!")

		const embed = {
			color: "#ff8000",
			title: `Timed out ${target.username}`,
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
					"name": "Duration",
					"value": `${interaction.options.getNumber('duration')} day(s)`
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

		await member.timeout(interaction.options.getNumber('duration') * 1000 * 60 * 60 * 24, reason);

		interaction.guild.channels.cache.get(config.channels.logs).send({ embeds: [embed] })
		member.send(`You were timed out in ${config.server_name}!\nReason: ${reason}\nDuration: ${interaction.options.getNumber('duration')} day(s)`)
		return interaction.reply({ content: `**Timed out ${target.username}**\nReason: ${reason}\nDuration: ${interaction.options.getNumber('duration')} day(s)` });
	},
};