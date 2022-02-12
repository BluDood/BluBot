const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Removes the timeout of a member.')
		.addUserOption(option => option.setName('target').setDescription('User to remove timeout for').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Reason for the timeout')),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') || "N/A";
		const member = interaction.guild.members.cache.get(target.id) || await interaction.guild.members.fetch(target.id).catch(err => { })
		const memberRoles = interaction.member.roles.cache.map(r => r.id)
		if (!memberRoles.some(v => config.allowRoles.includes(v))) return interaction.reply('You do not have permission to execute this command!');

		const embed = {
			color: "#2ECC70",
			title: `Removed the time-out for ${target.username}`,
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

		await member.timeout(null, reason);

		interaction.guild.channels.cache.get(config.channels.logs).send({ embeds: [embed] })
		member.send(`Your time-out was removed in ${config.server_name}!\nReason: ${reason}`)
		return interaction.reply({ content: `**Removed the timeout for ${target.username}**\nReason: ${reason}` });
	},
};