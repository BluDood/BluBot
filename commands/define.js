const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('define')
		.setDescription('Define a word with Urban Dictionary!')
		.addStringOption(option => option.setName('query').setDescription('Word to search for').setRequired(true)),
	async execute(interaction) {
		const api = 'https://urbanapi.herokuapp.com'
		const query = interaction.options.getString('query');
		interaction.deferReply()
		const res = await axios.get(`${api}/define/${query}`);
		const embed = {
			color: "#ff4545",
			title: await res.data.word,
			description: `${String(await res.data.meaning).replaceAll('<br>', '\n')}\n\n*${String(await res.data.example).replaceAll('<br>', '\n')}*`,
			footer: {
				"text": "Urban Dictionary API by BluDood",
				"icon_url": "https://i.pinimg.com/736x/f2/aa/37/f2aa3712516cfd0cf6f215301d87a7c2--dictionary-definitions-urban-dictionary.jpg"
			}
		};
		return interaction.editReply({ embeds: [embed] });
	},
};