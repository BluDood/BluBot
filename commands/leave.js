const { SlashCommandBuilder } = require('@discordjs/builders');
const voice = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Disconnect the bot from a voice channel.'),
	async execute(interaction) {
        const voiceChannel = await interaction.member.voice.channel;
        if (!voiceChannel) return interaction.reply('You need to be in a voice channel to execute this command.')
        voice.getVoiceConnection(voiceChannel.guild.id).disconnect();
		return interaction.reply('Left the voice channel!');
	},
};