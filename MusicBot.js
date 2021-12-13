/* NOT ACTUALLY FUNCTIONAL, JUST AN EXAMPLE */


const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { add } = require('libsodium-wrappers');
const queue = new Map();


const server_queue = queue.get(receivedMessage.guild.id);



async function playCommand(arguments, receivedMessage, server_queue, primaryCommand) {

    let song = {};
    if (ytdl.validateURL(arguments[0])) {
        const song_info = await ytdl.getInfo(arguments[0]);
        song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: song_info.videoDetails.lengthSeconds }
    } else {
        if (arguments == "") {
            receivedMessage.channel.send("Enter a song name")
        } else {
            const video_finder = async (query) => {
                const videoResult = await ytSearch(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
            }

            const video = await video_finder(arguments.join(' '));
            if (video) {
                song = { title: video.title, url: video.url, duration: video.duration }
            } else {
                receivedMessage.channel.send("Error finding video");
            }
        }
    }

    if (!server_queue) {
        if (arguments == "") {
            console.log("No args")
        } else {
            const queue_constructor = {
                voice_channel: receivedMessage.member.voice.channel.id,
                text_channel: receivedMessage.channel.id,
                connection: null,
                songs: []
            }

            queue.set(receivedMessage.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            try {
                const connection = joinVoiceChannel({
                    channelId: receivedMessage.member.voice.channel.id,
                    guildId: receivedMessage.guild.id,
                    adapterCreator: receivedMessage.guild.voiceAdapterCreator,
                    selfMute: false,
                    selfDeaf: false
                })
                connection.subscribe(player);
                queue_constructor.connection = connection;
                video_player(receivedMessage.guild, queue_constructor.songs[0], receivedMessage, server_queue);
            } catch (err) {
                queue.delete(receivedMessage.guild.id)
                receivedMessage.channel.send("There was an error connecting!");
                throw err;
            }
        }
    } else {
        if (arguments == "") {
            console.log("");
        } else {
            server_queue.songs.push(song);
            return receivedMessage.channel.send(`**${song.title}** added to queue!`);
        }
    }
}
function pauseCommand(arguments, receivedMessage) {
    if (player.state.status == "playing") {
        player.pause();
        receivedMessage.channel.send("Playback paused, use `;resume` to continue playback");
    } else {
        receivedMessage.channel.send("Player is already paused");
    }
}
function resumeCommand(arguments, receivedMessage) {
    if (player.state.status == "playing") {
        receivedMessage.channel.send("Player is already playing");
    } else {
        player.unpause();
        receivedMessage.channel.send("Playback resumed");
    }
}
function stopCommand(arguments, receivedMessage, server_queue) {
    stop_song(arguments, receivedMessage, server_queue)
}
function skipCommand(arguments, receivedMessage, server_queue) {
    skip_song(arguments, receivedMessage, server_queue)
}


const video_player = async (guild, song, receivedMessage, server_queue) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        const connection = joinVoiceChannel({
            channelId: receivedMessage.member.voice.channel.id,
            guildId: receivedMessage.guild.id,
            adapterCreator: receivedMessage.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        })
        connection.subscribe(player);
        connection.destroy();
        queue.delete(guild.id);
        return;
    }

    const stream = createAudioResource(ytdl(song.url, { filter: 'audioonly' }));
    player.play(stream)


    await receivedMessage.channel.send(`Now playing **${song.title}**`)
    let msDuration = (song.duration.seconds) * 1000 + 1000;
    setTimeout(() => { skip_song(arguments, receivedMessage, song_queue) }, msDuration);
}
const skip_song = (arguments, receivedMessage, server_queue) => {
    if (!receivedMessage.member.voice.channel) return receivedMessage.channel.send("You need to be in a channel to use this comman!")

    if (!server_queue) {
        return receivedMessage.channel.send("There are no songs in queue");
    }
    player.stop()
    server_queue.songs.shift();
    video_player(receivedMessage.guild, server_queue.songs[0], receivedMessage);
}
const stop_song = (arguments, receivedMessage, server_queue) => {
    if (!receivedMessage.member.voice.channel) return receivedMessage.channel.send("You need to be in a channel to use this comman!")
    server_queue.songs = [];
    player.stop();
    const connection = joinVoiceChannel({
        channelId: receivedMessage.member.voice.channel.id,
        guildId: receivedMessage.guild.id,
        adapterCreator: receivedMessage.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false
    })
    connection.subscribe(player);
    connection.destroy();
    queue.delete(receivedMessage.guild.id);
    receivedMessage.channel.send("Stopped Playback");
}