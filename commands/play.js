const { SlashCommandBuilder } = require('@discordjs/builders');
const {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource
} = require('@discordjs/voice');
const ytdl = require('ytdl-core')
const ytSearch = require('yt-search')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a video from YouTube')
		.addStringOption(option => option.setName('query').setDescription('Name of video to search for').setRequired(true)),
	async execute(interaction) {
		const query = interaction.options.getString('query');
		const voiceChannel = await interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply('You need to be in a voice channel to execute this command.')
		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});
		const videoFinder = async (query) => {
			// it works okay, go cry somewhere else
			if (String(query).includes('youtube.com/watch?v=')) {
				const videoId = String(query).split('?v=')[1].split('&')[0]
				const videoResult = await ytSearch({ videoId: videoId })
				return videoResult
			} else if (String(query).includes('youtu.be')) {
				const videoId = String(query).split('youtu.be/')[1]
				const videoResult = await ytSearch({ videoId: videoId })
				return videoResult
			} else {
				const videoResult = await ytSearch(query);
				return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
			}
		}
		const video = await videoFinder(query)
		if (video) {
			const stream = ytdl(video.url, { filter: 'audioonly' })
			const player = createAudioPlayer();
			const resource = createAudioResource(stream);
			player.play(resource)
			connection.subscribe(player)
			player.on('error', () => {
				interaction.channel.send("Error!")
			})
			return interaction.reply(`Playing ${video.title}!`);
		} else {
			return interaction.reply("Couldn't find that video!");
		}

	},
};