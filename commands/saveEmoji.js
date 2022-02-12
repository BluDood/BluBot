const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('saveemoji')
		.setDescription('Converts an emoji to an image.')
		.addStringOption(option => option.setName('emoji').setDescription('Emoji to convert').setRequired(true)),
	async execute(interaction) {
		if (!interaction.options.getString('emoji').includes("<")) return interaction.reply("Doesn't work with default emojis!")
		const emoji = interaction.options.getString('emoji').split(":")[2].replace(">", "")
		return interaction.reply(`https://cdn.discordapp.com/emojis/${emoji}.png`);
	},
};