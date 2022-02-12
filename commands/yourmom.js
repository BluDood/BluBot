const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yourmom')
		.setDescription("yo momma so phat she couldn't run this command"),
	async execute(interaction) {
		async function getJoke() {
			const data = await fetch('https://api.yomomma.info')
			return data.json()
		}
		var data = await getJoke()
		const embed = {
			color: "#0064FF",
			title: data.joke,
			footer: {
				text: `Powered by api.yomomma.info`,
			},
		};
		return interaction.reply({ embeds: [embed] });
	},
};