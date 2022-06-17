const {Client,Intents, MessageAttachment, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const {addSpeechEvent} = require("discord-speech-recognition");
const discordTTS = require('discord-tts');
const {AudioPlayer, AudioResource, AudioPlayerStatus, generateDependencyReport, createAudioResource, createAudioPlayer, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel, VoiceConnectionDisconnectReason} = require("@discordjs/voice");
const player = createAudioPlayer();
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { add } = require('libsodium-wrappers');
const queue = new Map();
const randomFacts = require('./random-facts.json');
const lastMsgId = require('./lastMessage.json');
const wiki = require('wikipedia');
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const { DiscordTogether } = require('discord-together');
const secret = require('./clientSecret.json');
const talkedRecently = new Set();
//const OpenAI = require('openai-api');
//const OPENAI_API_KEY = require('./openai.json');
//const openai = new OpenAI(OPENAI_API_KEY);
const quotesObj = require('./quotes.json');
const translate = require('@vitalets/google-translate-api');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS
    ],
});


client.discordTogether = new DiscordTogether(client);

let pokerUrl = "https://discord.com/invite/QCxTjyC3";
let chessUrl = "https://discord.com/invite/JS3ZKezA";
let ytUrl = "https://discord.com/invite/9bXPFSXj";

const joinButton = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('PRIMARY')
        .setDisabled(true),
    new MessageButton()
        .setCustomId('join')
        .setLabel('   𝘾𝙊𝙉𝙉𝙀𝘾𝙏 𝙏𝙊 𝘾𝙐𝙍𝙍𝙀𝙉𝙏 𝙑𝙊𝙄𝘾𝙀 𝘾𝙃𝘼𝙉𝙉𝙀𝙇     ')
        .setStyle('PRIMARY'),
    new MessageButton()
        .setCustomId('paddingRight')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('PRIMARY')
        .setDisabled(true),
);
const joinedButton = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
    new MessageButton()
        .setCustomId('disconnect')
        .setLabel('    𝘿𝙄𝙎𝘾𝙊𝙉𝙉𝙀𝘾𝙏 𝙁𝙍𝙊𝙈 𝙑𝙊𝙄𝘾𝙀 𝘾𝙃𝘼𝙉𝙉𝙀𝙇   ')
        .setStyle('SUCCESS'),
    new MessageButton()
        .setCustomId('paddingRight')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
);            
const standbyButton = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
    new MessageButton()
        .setCustomId('join')
        .setLabel('   𝘾𝙊𝙉𝙉𝙀𝘾𝙏 𝙏𝙊 𝘾𝙐𝙍𝙍𝙀𝙉𝙏 𝙑𝙊𝙄𝘾𝙀 𝘾𝙃𝘼𝙉𝙉𝙀𝙇     ')
        .setStyle('DANGER'),
    new MessageButton()
        .setCustomId('paddingRight')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
);
let activityButtonJoin = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft1')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
    new MessageButton()
        .setURL(chessUrl)
        .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(ytUrl)
        .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(pokerUrl)
        .setLabel(' 𝐏𝐎𝐊𝐄𝐑 ')
        .setStyle('LINK'),   
    new MessageButton()
        .setCustomId('paddingRight1')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true)
);
let activityButtonJoined = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft2')
        .setLabel('░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
    new MessageButton()
        .setURL(chessUrl)
        .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(ytUrl)
        .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(pokerUrl)
        .setLabel('𝐏𝐎𝐊𝐄𝐑')
        .setStyle('LINK'),   
    new MessageButton()
        .setCustomId('paddingRight2')
        .setLabel('░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true)
);
let activityButtonStandby = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('paddingLeft3')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true),
    new MessageButton()
        .setURL(chessUrl)
        .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(ytUrl)
        .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
        .setStyle('LINK'),
    new MessageButton()
        .setURL(pokerUrl)
        .setLabel(' 𝐏𝐎𝐊𝐄𝐑 ')
        .setStyle('LINK'),   
    new MessageButton()
        .setCustomId('paddingRight3')
        .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
        .setStyle('SECONDARY')
        .setDisabled(true)
);

function newButtons() {
    activityButtonJoin = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft1')
            .setLabel('░░░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setURL(chessUrl)
            .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(ytUrl)
            .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(pokerUrl)
            .setLabel(' 𝐏𝐎𝐊𝐄𝐑 ')
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight1')
            .setLabel('░░░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true)
        );
    activityButtonJoined = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft2')
            .setLabel('░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setURL(chessUrl)
            .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(ytUrl)
            .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(pokerUrl)
            .setLabel('𝐏𝐎𝐊𝐄𝐑')
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight2')
            .setLabel('░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true)
        );
    activityButtonStandby = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft3')
            .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setURL(chessUrl)
            .setLabel(' 𝐂𝐇𝐄𝐒𝐒 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(ytUrl)
            .setLabel(' 𝐘𝐨𝐮𝐓𝐮𝐛𝐞 ')
            .setStyle('LINK'),
            new MessageButton()
            .setURL(pokerUrl)
            .setLabel(' 𝐏𝐎𝐊𝐄𝐑 ')
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight3')
            .setLabel('░░░░░░░░░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true)
        );
}

addSpeechEvent(client, {profanityFilter: false, lang: 'en-GB'});
addSpeechEvent(client, {profanityFilter: false, lang: 'sv'});

let wApo = '`';
let textChannel;
let voiceConnection;
let audioPlayer=new AudioPlayer();
let user;
let mainMsg;
let msgStatus = 'booting';
let botCommands = "759506191705178152";
let server_queue;
let globalInteraction;
let btnComponent;
let btnContent;
let isPlaying = false;
let currentSong;
let subscription;
let subscription2;
let subscription3;
let currentGuild;
let currentDuration;
let isError = false;
let isReply = false;
let isDisconnect = false;
let isConversation = false;
let quotes = quotesObj;

const joinContent = '‎\n‎\n██████████████████████████████████████████████████████████████████████▀█\n█─▄▄▄▄█─▄▄─█▄─▀█▄─▄█▄─▄█─▄▄▄─███▄─▄─▀█─▄▄─█─▄▄─█─▄─▄─█▄─▄█▄─▀█▄─▄█─▄▄▄▄█\n█▄▄▄▄─█─██─██─█▄▀─███─██─███▀████─▄─▀█─██─█─██─███─████─███─█▄▀─██─██▄─█\n▀▄▄▄▄▄▀▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▀▄▄▄▄▄▀▀▀▄▄▄▄▀▀▄▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀';
const joinedContent = '‎\n‎\n█████████████████████████████████████████████████████████████████████\n█─▄▄▄▄█─▄▄─█▄─▀█▄─▄█▄─▄█─▄▄▄─███─▄▄─█▄─▀█▄─▄█▄─▄███▄─▄█▄─▀█▄─▄█▄─▄▄─█\n█▄▄▄▄─█─██─██─█▄▀─███─██─███▀███─██─██─█▄▀─███─██▀██─███─█▄▀─███─▄█▀█\n▀▄▄▄▄▄▀▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▀▄▄▄▄▄▀▀▀▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀';
const standbyContent = '‎\n‎\n████████████████████████████████████████████████████████████████████████████\n█─▄▄▄▄█─▄▄─█▄─▀█▄─▄█▄─▄█─▄▄▄─███─▄▄▄▄█─▄─▄─██▀▄─██▄─▀█▄─▄█▄─▄▄▀█▄─▄─▀█▄─█─▄█\n█▄▄▄▄─█─██─██─█▄▀─███─██─███▀███▄▄▄▄─███─████─▀─███─█▄▀─███─██─██─▄─▀██▄─▄██\n▀▄▄▄▄▄▀▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▀▄▄▄▄▄▀▀▀▄▄▄▄▄▀▀▄▄▄▀▀▄▄▀▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▀▀▄▄▄▄▀▀▀▄▄▄▀▀';
const ytContent = "████████████████████████████████████████████\n█▄─█─▄█─▄▄─█▄─██─▄█─▄─▄─█▄─██─▄█▄─▄─▀█▄─▄▄─█\n██▄─▄██─██─██─██─████─████─██─███─▄─▀██─▄█▀█\n▀▀▄▄▄▀▀▄▄▄▄▀▀▄▄▄▄▀▀▀▄▄▄▀▀▀▄▄▄▄▀▀▄▄▄▄▀▀▄▄▄▄▄▀";
const chessContent = "█████████████████████████████\n█─▄▄▄─█─█─█▄─▄▄─█─▄▄▄▄█─▄▄▄▄█\n█─███▀█─▄─██─▄█▀█▄▄▄▄─█▄▄▄▄─█\n▀▄▄▄▄▄▀▄▀▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀";
const pokerContent = "██████████████████████████████\n█▄─▄▄─█─▄▄─█▄─█─▄█▄─▄▄─█▄─▄▄▀█\n██─▄▄▄█─██─██─▄▀███─▄█▀██─▄─▄█\n▀▄▄▄▀▀▀▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀";

function initialCheckMsg(msg) {
    if(msg.id != mainMsg.id && msg.channel.id == botCommands) {
        let isVoiceMsg = false;
        checkMsg(msg, isVoiceMsg);
    }
}

function storeId() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    const lastMsg = [mainMsg];
    const stringData = JSON.stringify(lastMsg);
    fs.writeFile('lastMessage.json', stringData, (err) => {
        if (err) {
            throw err;
        }
        console.log(time + " : Updated latest message, ID : " + lastMsg[0].id);
    });
}
async function checkMsg(msg, isVoiceMsg) {
    switch (msgStatus) {
        case "booting":
            btnContent = joinContent
            btnComponent = [activityButtonJoin, joinButton]
            break;
        case "online":
            btnContent = joinedContent
            btnComponent = [activityButtonJoined, joinedButton]
            break;
        case "standby":
            btnContent = standbyContent
            btnComponent = [activityButtonStandby, standbyButton]
            break;
    }
    try{
        if (msg) {
            if( !isVoiceMsg && msg.author != client.user && !isReply ) {
                await msg.delete();
            } else {
                await mainMsg.delete();
                mainMsg = await client.channels.cache.get(botCommands).send({ content: btnContent, components: btnComponent });
            }
        } else {
            await mainMsg.delete();
            mainMsg = await client.channels.cache.get(botCommands).send({ content: btnContent, components: btnComponent });
        }
        // await mainMsg.delete();
        // mainMsg = await client.channels.cache.get(botCommands).send({ content: btnContent, components: btnComponent });
    } catch (e) {
        (console.error || console.log).call(console, e.stack || e);
        //console.log(`ERROR: msgStatus is invalid (${msgStatus} : (${msg}) : (${mainMsg.author})))`);
    }
    storeId();
}

client.on("messageCreate", async (msg) => {
    try{
        if(msg.type != "APPLICATION_COMMAND"){
            isReply = false;
        }
        currentGuild = msg.guild;
        setTimeout(() => { initialCheckMsg(msg) }, 500);
        if (talkedRecently.has(msg.author.id)) {
            console.log("5 second timeout : " + msg.author);
        } else {
            const voice_Channel = msg.member ?.voice.channel;
            textChannel = msg.channel;
            if (voice_Channel && msg.content == ";join") {
                try{
                    var voiceChannel = msg.member.voice.channelId;
                    if(!voiceConnection || voiceConnection?.status===VoiceConnectionStatus.Disconnected){
                        voiceConnection = joinVoiceChannel({
                            channelId: voiceChannel,
                            guildId: msg.guildId,
                            adapterCreator: msg.guild.voiceAdapterCreator,
                            selfDeaf: false
                        });
                        voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                        const resource = createAudioResource('music/sonic_ring_sound.mp3', {
                             inputType: StreamType.Arbitrary,
                             volume: 2
                        });
                        player.play(resource);
                        player.on(AudioPlayerStatus.Playing, () => {
                                // Do whatever you need to do when playing
                        });
                        voiceConnection.subscribe(player);
                    }
                } catch {return console.log("Error joining voice channel");}
            } else if (msg.content.includes(";youtube")) {
                togetherStart(msg);
            } else if (msg.content.includes(";poker")) {
                togetherStart(msg);
            } else if (msg.content.includes(";chess")) {
                togetherStart(msg);
            } else if (msg.content.includes(";doodlecrew")) {
                    togetherStart(msg);
            } else if (msg.content.includes(";awkword")) {
                togetherStart(msg);
            } else if (msg.content.includes(";wordsnack")) {
                togetherStart(msg);
            } else if (msg.content.includes(";play")) {
                let args = msg.content.replace(/;play /g,'');
                playCommand(args, msg);
            } else if (msg.content.includes(";skip")) {  
                //let args = msg.content.replace(/;play /g,'');
                skipCommand("", msg);
            } else if (msg.content.includes(";time")) {  
                //let args = msg.content.replace(/;play /g,'');
                getTime(msg);
            } else if (msg.content.includes("Sonic tell me about lemons")) {
                await pauseCommand();
                let theMsg = await wikipedia(msg);
                await tts(theMsg, msg);
            }
            // the user can type the command ... your command code goes here :)
                    // Adds the user to the set so that they can't talk for a minute
            if (msg.author.id == client.user.id) {
                return;
            } else {
            talkedRecently.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(msg.author.id);
            }, 5000);
                }
            }
    } catch {console.log("ERROR: Talked recently");}
});

function togetherStart(message) {
    if(message.member.voice.channel) {
        let args = message.content;
        if (args.includes(";")) {
            args = message.content.replace(/;/g,'');
        } else if (args.includes("sonic") || args.includes("Sonic")) {
            args = message.content.replace(/sonic /g,'');
            args = message.content.replace(/Sonic /g,'');
        }
        args = args.trim();
        args = args.toLowerCase();
        client.discordTogether.createTogetherCode(message.member.voice.channel.id, args).then(async invite => {
            let reply = `${invite.code}`;
            setTimeout(() => {  sendButton(reply, args) }, 500);
        });
    } else {
        let reply = "Sonic must be in a voice channel to use this feature"
        setTimeout(() => { sendMessage(reply) }, 500);
    }
}

async function sendMessage(reply) {
    return await client.channels.cache.get(botCommands).send(reply);
}
async function sendButton(reply, args) {
    const youtubeButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft4')
            .setLabel('░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setLabel('    YOUTUBE     ')
            .setURL(reply)
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight4')
            .setLabel('░░░░░░░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
        );
    const chessButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft')
            .setLabel('░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setLabel('    CHESS     ')
            .setURL(reply)
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight')
            .setLabel('░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
        );
    const pokerButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft')
            .setLabel('░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setLabel('    POKER     ')
            .setURL(reply)
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight')
            .setLabel('░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
        );
    const doodleButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft')
            .setLabel('░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setLabel('    Doodle     ')
            .setURL(reply)
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight')
            .setLabel('░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
        );
    const wordSnackButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('paddingLeft')
            .setLabel('░░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
            new MessageButton()
            .setLabel('    WORDSNACK     ')
            .setURL(reply)
            .setStyle('LINK'),
            new MessageButton()
            .setCustomId('paddingRight')
            .setLabel('░░░░░░░░')
            .setStyle('SECONDARY')
            .setDisabled(true),
        );

    switch (args) {
        case "youtube":
            btnComponent = youtubeButton;
            btnContent = ytContent;
            break;
        case "poker":
            btnComponent = pokerButton;
            btnContent = pokerContent;
            break;
        case "chess":
            btnComponent = chessButton;
            btnContent = chessContent; 
            break;  
        case "doodlecrew":
            btnComponent = doodleButton;
            btnContent = chessContent; 
            break;   
        case "wordsnack":
            btnComponent = wordSnackButton;
            btnContent = chessContent; 
            break;        
    }
    return await client.channels.cache.get(botCommands).send({
        content: btnContent,
        components: [btnComponent]
    });
}

let pastSpeech;

client.on("speech", async (msg) => {
    if (!msg.content) {
        return;
    } else {
        let isSwedish = false;
        let hasRole = msg.member.roles.cache.some(r => r.name === "Sweden");
        if(hasRole && !msg.content.includes("Sonic")) {
            await translate(msg.content, {to: 'en'}).then(res => {
                if(res.from.language.iso == 'sv') {
                    console.log(msg.content);
                    console.log('Translation: ' + res.text);
                    pastSpeech = res.text;
                    isSwedish = true;
                } else {
                    isSwedish = false;
                }
            }).catch(err => {
                console.error(err);
            });
        }
        if (talkedRecently.has(msg.author.id) || isSwedish == true) {
            console.log();
        } else {
            currentGuild = msg.guild;
            console.log(msg.content);

            if(!isConversation){
                if (msg.content.includes("sonic") || msg.content.includes("Sonic") || msg.content.includes("onyx") || msg.content.includes("Onyx"))   {
                    // if (msg.content.includes("conversation")) {
                    //     isConversation = true;
                    //     return;
                    // }
                    if (msg.content.includes("play") || msg.content.includes("Play")) {
                        lowerCase = msg.content.toLowerCase();
                        let args = lowerCase.replace(/sonic play/g,'');
                        console.log(args);
                        playCommand(args, msg);
                    } else if (msg.content.includes("pause")) {
                        let args = msg.content.replace(/Sonic play/g,'');
                        pauseCommand(args, msg);
                    } else if (msg.content.includes("stop") || msg.content.includes("Stop")) {
                        let args = msg.content.replace(/Sonic play/g,'');
                        stopCommand(args, msg);
                    } else if (msg.content.includes("resume")) {
                        let args = msg.content.replace(/Sonic play/g,'');
                        resumeCommand(args, msg);
                    } else if (msg.content.includes("skip") || msg.content.includes("skit") || msg.content.includes("skate")) {
                        let args = msg.content.replace(/Sonic play/g,'');
                        skipCommand(args, msg);
                    } else if (msg.content.includes("youtube") || msg.content.includes("Youtube")) {
                        togetherStart(msg);
                    } else if (msg.content.includes("poker") || msg.content.includes("Poker")) {
                        togetherStart(msg);
                    } else if (msg.content.includes("chess") || msg.content.includes("Chess")) {
                        togetherStart(msg);
                    } else if (msg.content.includes("fact")) {
                        var randomItem = randomFacts[Math.floor(Math.random() * randomFacts.length)];
                        textChannel.send(`‎\n${wApo} 𝙁𝙖𝙘𝙩: ${randomItem} ${wApo}`)
                        tts(randomItem, msg);
                    } else if (msg.content.includes("help")) {
                        textChannel.send("**Welcome to Voided.exe**\nWhat would you like help with?\n`;help roles` `;help fact` `;help suggestion` `;help roll` `;help serverinfo`");
                    } else if (msg.content.includes("roll")) {
                        let number = msg.content.match(/\d+/g);
                        roll(number, msg);            
                    } else if (msg.content.includes("say") || msg.content.includes("said")) {
                        tts(msg.content, msg);
                    } else if (msg.content.includes("time") || msg.content.includes("Time")) {
                        getTime(msg);
                    } else if (msg.content.includes("date") || msg.content.includes("Date")) {
                        getDate(msg);
                    } else if (msg.content.includes("move") || msg.content.includes("Move") || msg.content.includes("movie") || msg.content.includes("Movie")) {
                        moveTo(msg);
                    } else if (msg.content.includes("tell me about")) {
                        wikipedia(msg);
                    } else if (msg.content.includes("translate") || msg.content.includes("Translate")) {
                        tts(pastSpeech, msg);
                    } else if (msg.content.includes("hi") || msg.content.includes("hey") || msg.content.includes("hello") || msg.content.includes("Hi") || msg.content.includes("Hey") || msg.content.includes("Hello")) {
                        if(msg.author=="354380508257452042") {
                            user = "Gez";
                        } else if(msg.author=="322412820287193098") {
                            user = "Joe";
                        } else if(msg.author=="391652823798120460") {
                            user = "Toby";
                        } else if(msg.author=="130122865998561281") {
                            user = "Jack";
                        } else if(msg.author=="192688164844994560") {
                            user = "Morgan";
                        } else if(msg.author=="288403474067095554") {
                            user = "Lewis";
                        } else if(msg.author=="407179353999409153") {
                            user = "Kiwi";
                        } else {
                            user = "dude";
                        }
                        let helloMsgs = ["Hey there " + user, "Hi " + user + ", how's it going?", "What's up " + user, "Yo " + user + ", what's popping my g?", "Hello " + user + ", how're you?", "Howdy " + user + ", what's up?", "How's it going " + user + "?", "Good day " + user, "Yo " + user + ", enjoying the weather?"];
                        let randomMsg = helloMsgs[Math.floor(Math.random() * helloMsgs.length)];
                        tts(randomMsg, msg);
                    }

                } else {return;}
            } else {
                if(msg.content.includes("end conversation")) {
                    isConversation = false;
                    return;
                }
                // let message = msg.content;
                // aiResponse(message, msg);
                //console.log(newMsg)
            } 
        }
        if (msg.author.id == client.user.id || isSwedish) {
            return;
        } else {
            talkedRecently.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(msg.author.id);
            }, 2000);
        }
    }
});

// async function translateMsg(msg, pastSpeech) {
//     translate(pastSpeech, {from: 'sv', to: 'en'}).then(res => {
//         console.log(res.text);
//         tts(res.text);
//     }).catch(err => {
//         console.error(err);
//     });
// }

async function wikipedia(msg) {
	try {
        let query= msg.content.replace(/Sonic tell me about /g,'');
        const page = await wiki.page(query);
        const summary = await page.summary();
        const wikiEmbed = {
            title: "**" + page.title.toUpperCase() + "**",
            description: summary.extract,
            color: 0x485FFF,
            url: page.fullurl,
            image: {
                url: summary.originalimage.source
            },
        };
        textChannel.send("‎");
        textChannel.send({ embeds: [wikiEmbed]});

        let summarySplit = summary.extract.split(".")
        if (summarySplit.length < 200) {
            tts(summarySplit[0], msg);
        }
        else {
            return;
        }
    } catch (error) {
        console.log(error);     // type of wiki error
    }
}

function moveTo(msg) {
    try {
        let voiceChannels = msg.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE');
        let voiceChannelName = voiceChannels.map(a => a.name);
        let voiceChannelID = voiceChannels.map(a => a.id);

        const guild = client.guilds.cache.get(msg.guild.id);

        for (let i = 0; i < voiceChannelName.length; i++) {
            if (msg.content.toLowerCase().includes(" me ")) {

                if (msg.content.toLowerCase().includes(voiceChannelName[i].toLowerCase())) {
                    msg.guild.members.cache.get(msg.member.id).voice.setChannel(voiceChannelID[i]);
                }
            } else if (msg.content.toLowerCase().includes(" us ") || msg.content.toLowerCase().includes(" movers ")) {

                if (msg.content.toLowerCase().includes(voiceChannelName[i].toLowerCase())) {
                    for (const [channelID, channel] of voiceChannels) {
                        for (const [memberID, member] of channel.members) {
                            member.voice.setChannel(voiceChannelID[i]).then(() => console.log(`Moved ${member.user.tag}.`)).catch(console.error);
                        }
                    }
                }
            } else {
                return;
            }
        }
    } catch {
        console.log("Error moving user(s)");
    }
}

function getTime(msg) {
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    if(hour.length < 2) {
        hour = "0" + hour;
    }
    if(minute.length < 2) {
        hour = "0" + minute;
    }
    var time = hour + ", " + minute;
    tts(time, msg);
}

function getDate(msg) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    tts(date, msg);
}

function roll(args, msg) {
    try {
        maxRoll = parseInt(args)
        if (!maxRoll) {
            textChannel.send(`‎\n${wApo} 𝙮𝙤𝙪 𝙛𝙤𝙧𝙜𝙤𝙩 𝙩𝙤 𝙨𝙖𝙮 𝙖 𝙣𝙪𝙢𝙗𝙚𝙧 ${wApo}`)
        } else {
            randomNumber = Math.floor(Math.random() * maxRoll) + 1
            if (randomNumber == "NaN" || !randomNumber || randomNumber == "") {
                textChannel.send(`‎\n${wApo} 𝙮𝙤𝙪 𝙛𝙤𝙧𝙜𝙤𝙩 𝙩𝙤 𝙨𝙖𝙮 𝙖 𝙣𝙪𝙢𝙗𝙚𝙧 ${wApo}`)
            } else {
                textChannel.send("‎\n<@" + msg.author.id + ">\n" + `${wApo} 𝙧𝙤𝙡𝙡𝙚𝙙 ${randomNumber.toString()} ${wApo}`)
                console.log(randomNumber);
                numString = randomNumber.toString();
                tts(numString, msg)
            }
        }
    } catch {
        (console.log("Error rolling number"));
    }
}
let promptHistory = "";
async function aiResponse(message, msg) {
    (async () => {
        const gptResponse = await openai.complete({
            engine: 'davinci',
            prompt: "Human: " + message +"?\nAI:",
            maxTokens: 20,
            temperature: 0.5,
            topP: 1,
            presencePenalty: 0,
            frequencyPenalty: 0,
            bestOf: 1,
            n: 1,
            stream: false,
            stop: ['\n', " Human:", " AI:"]
        });
        let response = gptResponse.data.choices[0].text;
        //console.log(gptResponse.data);
        //console.log(response);
        if(response.includes("Q:")){
            response = response.replace(/Q:/g,'. ');
        }
        if(response.includes("A:")) {
            response = response.replace(/A:/g,'. ');
        }
        promptHistory = "Human: " + message + "?\nAI: " + response;
        console.log(promptHistory);
        tts(response);
    })();
}
audioPlayer.on(AudioPlayerStatus.Idle, () => {
    subscription2.unsubscribe(audioPlayer);
    if(isPlaying){
        subscription = voiceConnection.subscribe(player);
        let resume = true;
        player.unpause();
    }
});
async function tts(message, msg) {
    try {
        
        if (isPlaying) {
            //currentDuration = player.state.playbackDuration;
            player.pause();
        }
        let trimmedMsg = message.replace(/Sonic say/g, '');
        const stream = discordTTS.getVoiceStream(trimmedMsg);
        const audioResource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true
        });
        if (voiceConnection.status === VoiceConnectionStatus.Connected) {
            subscription2 = voiceConnection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
        }
        
    } catch (e) {
        //(console.log("Error with tts"));
        (console.error || console.log).call(console, e.stack || e);
    }

}

let guildID;
let recentMessage;
async function playCommand(arguments, receivedMessage) {
    try{
        guildID = receivedMessage.guild.id;
        recentMessage = receivedMessage;
        const voice_Channel = receivedMessage.member ?.voice.channel;
        if (voice_Channel){
            server_queue = queue.get(receivedMessage.guild.id);
            let song = {};
            if (ytdl.validateURL(arguments[0])) {
                const song_info = await ytdl.getInfo(arguments[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url, duration: song_info.videoDetails.lengthSeconds }
            } else {
                if (arguments == "") {
                    client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙚𝙣𝙩𝙚𝙧 𝙖 𝙨𝙤𝙣𝙜 𝙣𝙖𝙢𝙚 ${wApo}`)
                } else {
                    const video_finder = async (query) => {
                        const videoResult = await ytSearch(query);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
                    }

                    const video = await video_finder(arguments);
                    if (video) {
                        song = { title: video.title, url: video.url, duration: video.duration }
                    } else {
                        client.channels.cache.get(botCommands).send("Error finding video");
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
                        if(!voiceConnection) {
                            receivedMessage.channel.send("You must be in a voice channel to use this feature");
                        } else {
                            voiceConnection.subscribe(player);
                            queue_constructor.connection = voiceConnection;
                            firstPlay = true;
                            video_player(receivedMessage.guild, queue_constructor.songs[0], receivedMessage);
                        }

                    } catch (err) {
                        queue.delete(receivedMessage.guild.id)
                        client.channels.cache.get(botCommands).send("There was an error connecting!");
                        throw err;
                    }
                }
            } else if (server_queue.songs.length === 0){
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
                        if(!voiceConnection) {
                            receivedMessage.channel.send("You must be in a voice channel to use this feature");
                        } else {
                            voiceConnection.subscribe(player);
                            queue_constructor.connection = voiceConnection;
                            video_player(receivedMessage.guild, queue_constructor.songs[0], receivedMessage);
                        }

                    } catch (err) {
                        queue.delete(receivedMessage.guild.id)
                        client.channels.cache.get(botCommands).send("There was an error connecting!");
                        throw err;
                    }
                }
            } else {
                if (arguments == "") {
                    console.log("No args");
                } else {
                    server_queue.songs.push(song);
                    return client.channels.cache.get(botCommands).send(`‎\n${wApo} ∿ 𝙦𝙪𝙚𝙪𝙞𝙣𝙜 ⫸ ${song.title.toLowerCase()}〈${song.duration.timestamp}〉${wApo}`);
                }
            }
        } else {
            client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙮𝙤𝙪 𝙢𝙪𝙨𝙩 𝙗𝙚 𝙞𝙣 𝙖 𝙫𝙤𝙞𝙘𝙚 𝙘𝙝𝙖𝙣𝙣𝙚𝙡 𝙩𝙤 𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 ${wApo}`);
        }
    } catch (e){
        (console.error || console.log).call(console, e.stack || e);
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙮𝙤𝙪 𝙢𝙪𝙨𝙩 𝙗𝙚 𝙞𝙣 𝙖 𝙫𝙤𝙞𝙘𝙚 𝙘𝙝𝙖𝙣𝙣𝙚𝙡 𝙩𝙤 𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 ${wApo}`);

    }
}
async function pauseCommand(arguments, receivedMessage) {
    if (player.state.status == "playing") {
        player.pause();
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙥𝙖𝙪𝙨𝙚𝙙 ${wApo}\n${wApo} 𝘵𝘺𝘱𝘦 ;𝙧𝙚𝙨𝙪𝙢𝙚 𝘵𝘰 𝘤𝘰𝘯𝘵𝘪𝘯𝘶𝘦 𝘱𝘭𝘢𝘺𝘣𝘢𝘤𝘬 ${wApo}`);
    } else {
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙞𝙨 𝙖𝙡𝙧𝙚𝙖𝙙𝙮 𝙥𝙖𝙪𝙨𝙚𝙙 ${wApo}`);
    }
}
async function resumeCommand(arguments, receivedMessage) {
    if (player.state.status == "playing") {
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙞𝙨 𝙖𝙡𝙧𝙚𝙖𝙙𝙮 𝙥𝙖𝙪𝙨𝙚𝙙 ${wApo}`);
    } else {
        player.unpause();
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙧𝙚𝙨𝙪𝙢𝙚𝙙 ${wApo}`); 
    }
}
function stopCommand(arguments, receivedMessage) {
    stop_song(arguments, receivedMessage)
}
function skipCommand(arguments, receivedMessage) {
    skip_song(arguments, receivedMessage)
}
async function leaveCommand(arguments, receivedMessage) {
    if(voiceConnection) {
        try {
            if(subscription) {
                subscription.unsubscribe(player);
            } 
            if(subscription2) {
                subscription2.unsubscribe(audioPlayer);
            } 
            if(subscription3) {
                subscription3.unsubscribe(player);
            }
            server_queue = "";
            queue.delete(receivedMessage.guild.id)
            voiceConnection = await voiceConnection.destroy();
        } catch (e) {
            (console.error || console.log).call(console, e.stack || e);
        }
    }
    if (!globalInteraction) {
        return;
    } else {
        let interaction = globalInteraction;
        let isVoiceMsg = true;
        msgStatus = "standby";
        //setTimeout(() => { checkMsg(receivedMessage, isVoiceMsg) }, 500);
    }    
}

const video_player = async (guild, song, receivedMessage, resume) => {
    const song_queue = queue.get(guild.id);

  
    if (!song) {
        queue.delete(guild.id);
        return;
    }
    const stream = createAudioResource(ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', volume: 0.1 }));
    isPlaying = true;
    currentSong = song;
    player.play(stream, {volume: 0.1});
    try {
        await client.channels.cache.get(botCommands).send(`‎\n█▄░█ █▀█ █░█░█   █▀█ █░░ ▄▀█ █▄█ █ █▄░█ █▀▀\n█░▀█ █▄█ ▀▄▀▄▀   █▀▀ █▄▄ █▀█ ░█░ █ █░▀█ █▄█\n**_${song.title}_** ${wApo}〈${song.duration.timestamp}〉${wApo}`)
    } catch (e){
        console.log(e);
    }
}
player.on(AudioPlayerStatus.Idle, () => {
    if(!joinSound) {
        if (!server_queue || server_queue.songs.length === 0) {
            isPlaying = false;
            queue.delete(guildID);
            server_queue = "";
            subscription.unsubscribe(player);
            return;
        } else {
            server_queue.songs.shift();
            try{
                player.play(getNextResource("", recentMessage));
            } catch (e) {
                (console.error || console.log).call(console, e.stack || e);
            }
        }
    } else {
        subscription3.unsubscribe(player);
        subscription = voiceConnection.subscribe(player);
        joinSound = false;
    }
    
});
player.on(AudioPlayerStatus.Playing, () => {
    if (isError) {
        isError = false;
    } else {
        return;
    }
});
player.on('error', error => {
    if (!isError) {
        console.error("Playback error");
        client.channels.cache.get(botCommands).send("Sorry! I ran into an problem");
        isError = true;
        skipCommand("", recentMessage);
    } else {
        return;
    }
});

const getNextResource = (args, receivedMessage) => {
    return createAudioResource(ytdl(server_queue.songs[0].url, { filter: 'audioonly', volume: 2 }));
}

function noSongsQueued() {
    if(!isError) {
        client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙩𝙝𝙚𝙧𝙚 𝙖𝙧𝙚 𝙣𝙤 𝙨𝙤𝙣𝙜𝙨 𝙦𝙪𝙚𝙪𝙚𝙙 ${wApo}`);
    } else {return;}
}

const skip_song = (arguments, receivedMessage) => {
    if (!receivedMessage.member.voice.channel) return client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙮𝙤𝙪 𝙣𝙚𝙚𝙙 𝙩𝙤 𝙗𝙚 𝙞𝙣 𝙖 𝙘𝙝𝙖𝙣𝙣𝙚𝙡 𝙩𝙤 𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 ${wApo}`)

    if (!server_queue || server_queue.songs.length === 0) {
        player.stop()
        queue.delete(receivedMessage.guild.id);
        server_queue = queue.get(receivedMessage.guild.id);
        subscription.unsubscribe(player);
        setTimeout(() => { noSongsQueued() }, 1000);
    } else {
        //player.stop()
        server_queue.songs.shift();
        video_player(receivedMessage.guild, server_queue.songs[0], receivedMessage);
    }
}

const stop_song = (arguments, receivedMessage) => {
    if (!receivedMessage.member.voice.channel) return client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙮𝙤𝙪 𝙣𝙚𝙚𝙙 𝙩𝙤 𝙗𝙚 𝙞𝙣 𝙖 𝙘𝙝𝙖𝙣𝙣𝙚𝙡 𝙩𝙤 𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 ${wApo}`)
    
    player.stop();
    queue.delete(receivedMessage.guild.id);
    server_queue = "";
    subscription.unsubscribe(player);
    client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙨𝙩𝙤𝙥𝙥𝙚𝙙 ${wApo}`
    );
}

client.on("ready", async () => {
    console.log("Ready!");
    client.user.setPresence({ activities: [{ type: 'STREAMING', name: 'the AI Takeover', url: 'https://www.twitch.tv/voidedrl' }], status: 'dnd' });
    try {
        const messages = await client.channels.cache.get(botCommands).messages.fetch();
        let theMsg = messages.filter((msg) => msg.id.startsWith(lastMsgId[0].id));
        if (theMsg) {
            theMsg.forEach(element => element.delete());  
        }
    } catch {
        (console.log("Error deleting previous message"));
    }

	mainMsg = await client.channels.cache.get(botCommands).send({ content: joinContent, components: [activityButtonJoin, joinButton] });
    msgStatus = "booting";
    storeId();
});
let joinSound = false;
async function buttonJoin (interaction) {
    try{
        const voice_Channel = interaction.member ?.voice.channel;
        if (voice_Channel) {
            var voiceChannel = interaction.member.voice.channelId;
            if(!voiceConnection || voiceConnection?.status===VoiceConnectionStatus.Disconnected){
                voiceConnection = joinVoiceChannel({
                    channelId: voiceChannel,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                voiceConnection=await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
                const resource = createAudioResource('music/sonic_ring_sound.mp3', {
                        inputType: StreamType.Arbitrary,
                        volume: 2
                    });
                subscription3 = voiceConnection.subscribe(player);
                player.play(resource);
                joinSound = true;
                // player.on(AudioPlayerStatus.Idle, () => {
                //     subscription3.unsubscribe(audioPlayer);
                //     subscription = voiceConnection.subscribe(player);
                // });
            }
        }
    } catch {console.log("Error joining voice channel");}
}

async function addquote(msg, user, quote) {
    console.log(user);
    console.log(quote);
    let username;

    if (user.includes('<@!')) {
        let user1 = user.replace(/<@!/g,'');
        let theUser = user1.replace(/>/g,'');
        if(theUser=="354380508257452042") {
            username = "Gez";
        } else if(theUser=="322412820287193098") {
            username = "Joe";
        } else if(theUser=="391652823798120460") {
            username = "Toby";
        } else if(theUser=="130122865998561281") {
            username = "Jack";
        } else if(theUser=="192688164844994560") {
            username = "Morgan";
        } else if(theUser=="288403474067095554") {
            username = "Lewis";
        } else if(theUser=="407179353999409153") {
            username = "Kiwi";
        } else {
            await msg.reply("No quotes for the user: " + user);
        }
        if (username) {
            try {
                quotes[username].push(quote);
                updateQuotes();
                await msg.reply("Added quote from " + user + ": *" + quote + "*");
            }catch (e){console.log(e)}
        } else {return;}
    } else {
        user = user.toLowerCase();
        user = user.charAt(0).toUpperCase() + user.slice(1);
        if(user) {
            try{
                quotes[user].push(quote);
                updateQuotes();
                await msg.reply("Added quote from " + user + ": *" + quote + "*");
            } catch { await msg.reply("No quotes for the user: " + user) }
        } else {
            await msg.reply("No quotes for the user: " + user);
        }
    }
}


async function sendquote(msg, user) {
    let username;
    //console.log(quotes);
    if (user.includes('<@!')) {
        let user1 = user.replace(/<@!/g,'');
        let theUser = user1.replace(/>/g,'');
        if(theUser=="354380508257452042") {
            username = "Gez";
        } else if(theUser=="322412820287193098") {
            username = "Joe";
        } else if(theUser=="391652823798120460") {
            username = "Toby";
        } else if(theUser=="130122865998561281") {
            username = "Jack";
        } else if(theUser=="192688164844994560") {
            username = "Morgan";
        } else if(theUser=="288403474067095554") {
            username = "Lewis";
        } else if(theUser=="407179353999409153") {
            username = "Kiwi";
        } else {
            await msg.reply("No quotes for the user: " + user);
        }
        if(username) {
            try{
                var randomItem = Math.floor(Math.random() * quotes[username].length);
                await msg.reply(username + ": *" + quotes[username][randomItem] + "*");
            } catch { console.log("An error occured") }
        } else {
            await msg.reply("No quotes for the user: " + user);
        }
    }
    else {
        user = user.toLowerCase();
        user = user.charAt(0).toUpperCase() + user.slice(1);
        if(user) {
            try{
                var randomItem = Math.floor(Math.random() * quotes[user].length);
                await msg.reply(user + ": *" + quotes[user][randomItem] + "*");
            } catch { console.log("No quotes for the user: ") }
        } else {
            await msg.reply("No quotes for the user: " + user);
        }
    }
}

function updateQuotes() {
    try{
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes();
        const stringData = JSON.stringify(quotes);
        fs.writeFile('quotes.json', stringData, (err) => {
        if (err) {
            throw err;
        }
        console.log(time + " : Updated quotes");
    });
    }catch(e) {console.log(e)}
}

client.on('interactionCreate', async (interaction) => {
    try{
	    if (interaction.isButton()) {
            globalInteraction = interaction;
            if (interaction.customId === 'join') {
                isDisconnect = false;
                if (interaction.member.voice.channel){
                    await interaction.deferUpdate();
                    await wait(100);
                    await client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'youtube').then(invite => {
                        ytUrl = (`${invite.code}`);
                    });
                    await client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'chess').then(invite => {
                        chessUrl = (`${invite.code}`);
                    });
                    await client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'poker').then(invite => {
                        pokerUrl = (`${invite.code}`);
                    });
                    //console.log(chessUrl);
                    newButtons();
                    await interaction.editReply({ content: joinedContent, components: [activityButtonJoined, joinedButton] });
                    msgStatus = "online";
                    buttonJoin(interaction);
                    storeId();
                }
            }
            if (interaction.customId === 'disconnect') {
                await interaction.deferUpdate();
                await wait(100);
                await interaction.editReply({ content: standbyContent, components: [activityButtonStandby, standbyButton] });
                msgStatus = "standby";
                isDisconnect = true;
                leaveCommand("", interaction);
            }
        } else if (interaction.isCommand()) {
            const { commandName } = interaction;
            isReply = true;
        
	        if (commandName === 'ping') {
	        	await interaction.reply('Pong!');
	        } else if (commandName === 'server') {
	        	await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	        } else if (commandName === 'user') {
	        	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	        } else if (commandName === 'play') {
                let args = interaction.options.getString('song');
                await interaction.reply(`Searching ` + args + `...`);
                playCommand(args, interaction);
            } else if (commandName === 'skip') {
                await interaction.reply(`Skipping ...`);
                skipCommand("", interaction);
            } else if (commandName === 'stop') {
                await interaction.reply(`Stopping ...`);
                stopCommand("", interaction);
            } else if (commandName === 'pause') {
                await interaction.reply(`Pausing ...`);
                pauseCommand("", interaction);
            } else if (commandName === 'resume') {
                await interaction.reply(`Resuming ...`);
                resumeCommand("", interaction);
            } else if (commandName === 'keep') {
                let args = interaction.options.getString('message');
                await interaction.reply(args);
            } else if (commandName === 'addquote') {
                let user = interaction.options.getString('username');
                let quote = interaction.options.getString('quote');
                addquote(interaction, user, quote);
            } else if (commandName === 'quote') {
                let user = interaction.options.getString('user');
                sendquote(interaction, user);
            }
        } else {return;}
    } catch (e) {console.log(e);}
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channel === null && newState.channel !== null && !isDisconnect) {
        if (oldState.member.id == '192688164844994560') {
            playCommand('https://youtu.be/bxiV02ou-z0', globalInteraction);
        } else if (oldState.member.id == '130122865998561281') {
            playCommand('https://youtu.be/TMIYsoYwh0M', globalInteraction);
        } else if (oldState.member.id == '354380508257452042') {
            playCommand('https://youtu.be/e3xuisGGzVQ', globalInteraction);
        } else if (oldState.member.id == '601883133981229072') {
            playCommand('https://youtu.be/TnM1w3sp83Y', globalInteraction);
        } else if (oldState.member.id == '322412820287193098') {
            playCommand('https://youtu.be/-WWm94Iqo6E', globalInteraction);
        }
    }
    // if nobody left the channel in question, return.
    if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel || isDisconnect)
      return;
    // otherwise, check how many people are in the channel now
    if (oldState.channel.members.size == 1) {
        try{
            setTimeout(() => { // if 1 (you)
                if (oldState.channel.members.size == 1){
                    mainMsgOnLeave(oldState);
                }
            }, 1000); // (1 sec in ms)
        } catch (err){
            throw err;
        }
    }
});
async function mainMsgOnLeave(oldState) {
    try{
        msgStatus = "standby";
        btnContent = standbyContent
        btnComponent = [activityButtonStandby, standbyButton]
        await mainMsg.delete();
        mainMsg = await client.channels.cache.get(botCommands).send({ content: btnContent, components: btnComponent });
        storeId();
    } catch (e) {
        console.log(e);
    }
    leaveCommand("", oldState);
}

client.login(secret);