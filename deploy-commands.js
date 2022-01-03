const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = require('./clientSecret.json');
const { clientId, guildId } = require('./clientId.json');

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song!')
		.addStringOption(option => 
			option.setName('song')
			.setDescription("Queue's the song and plays it")
			.setRequired(true)),
	new SlashCommandBuilder().setName('stop').setDescription('Stops music playback'),
	new SlashCommandBuilder().setName('skip').setDescription('Skips current track'),
	new SlashCommandBuilder().setName('pause').setDescription('Pauses music playback'),
	new SlashCommandBuilder().setName('resume').setDescription('Resumes music playback'),
	new SlashCommandBuilder().setName('keep').setDescription('Retains the message').addStringOption(option => 
		option.setName('message')
		.setDescription("Retains the message")
		.setRequired(true)),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);