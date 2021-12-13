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

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
});

client.discordTogether = new DiscordTogether(client);

const pokerUrl = "https://discord.com/invite/QCxTjyC3";
const chessUrl = "https://discord.com/invite/JS3ZKezA";
const ytUrl = "https://discord.com/invite/4fbTscFh";

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
const activityButtonJoin = new MessageActionRow()
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
const activityButtonJoined = new MessageActionRow()
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
const activityButtonStandby = new MessageActionRow()
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

addSpeechEvent(client, {profanityFilter: false});

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
        if(msg.author != mainMsg.author && !isVoiceMsg) {
            await msg.delete();
        }
        await mainMsg.delete();
        mainMsg = await client.channels.cache.get(botCommands).send({ content: btnContent, components: btnComponent });
    } catch {console.log(`ERROR: msgStatus is invalid (${msgStatus} : (${msg}) : (${mainMsg.author})))`);}
    
    storeId();
}

client.on("messageCreate", async (msg) => {
    
    try{
        if (talkedRecently.has(msg.author.id)) {
            console.log("5 second timeout" + msg.author);
        } else {
        
            // the user can type the command ... your command code goes here :)
        
            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(msg.author.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(msg.author.id);
            }, 5000);
        }
    } catch {console.log("ERROR: Talked recently");}
    
    setTimeout(() => { initialCheckMsg(msg) }, 500);

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
    } else if (msg.content.includes("Sonic tell me about lemons")) {
        await pauseCommand();
        let theMsg = await wikipedia(msg);
        await tts(theMsg);
    }
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

client.on("speech", (msg) => {
    if (!msg.content) {
        return;
    } else {
        console.log(msg.content);
        if (msg.content.includes("sonic") || msg.content.includes("Sonic")) {
            if (msg.content.includes("play")) {
                let args = msg.content.replace(/Sonic play/g,'');
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
            } else if (msg.content.includes("leave") || msg.content.includes("leaf") || msg.content.includes("sonically")) {
                let args = msg.content.replace(/Sonic play/g,'');
                leaveCommand(args, msg);
            } else if (msg.content.includes("skip") || msg.content.includes("skit")) {
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
                tts(randomItem);
            } else if (msg.content.includes("help")) {
                textChannel.send("**Welcome to Voided.exe**\nWhat would you like help with?\n`;help roles` `;help fact` `;help suggestion` `;help roll` `;help serverinfo`");
            } else if (msg.content.includes("roll")) {
                let number = msg.content.match(/\d+/g);
                roll(number, msg);            
            } else if (msg.content.includes("say") || msg.content.includes("said")) {
                tts(msg.content);
            } else if (msg.content.includes("time") || msg.content.includes("Time")) {
                getTime();
            } else if (msg.content.includes("date") || msg.content.includes("Date")) {
                getDate();
            } else if (msg.content.includes("move") || msg.content.includes("Move") || msg.content.includes("movie") || msg.content.includes("Movie")) {
                moveTo(msg);
            } else if (msg.content.includes("tell me about")) {
                wikipedia(msg);
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
                }
                let helloMsgs = ["Hey there " + user, "Hi " + user + ", how's it going?", "What's up " + user, "Yo " + user + ", what's popping my g?", "Hello " + user + ", how're you?", "Howdy " + user + ", what's up?", "How's it going " + user + "?", "Good day " + user, "Yo " + user + ", enjoying the weather?"];
                let randomMsg = helloMsgs[Math.floor(Math.random() * helloMsgs.length)];
                tts(randomMsg);
            } 
        } else {return;}
    }
});

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
        textChannel.send({ embeds: [wikiEmbed]});

        let summarySplit = summary.extract.split(".")
        if (summarySplit.length < 200) {
            tts(summarySplit[0]);
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

function getTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    tts(time);
}

function getDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    tts(date);
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
                tts(numString)
            }
        }
    } catch {
        (console.log("Error rolling number"));
    }
}


async function tts(message) {
    try {
        let trimmedMsg = message.replace(/Sonic say/g, '');
        const stream = discordTTS.getVoiceStream(trimmedMsg);
        const audioResource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true
        });
        if (voiceConnection.status === VoiceConnectionStatus.Connected) {
            voiceConnection.subscribe(audioPlayer);
            audioPlayer.play(audioResource);
        }
    } catch {
        (console.log("Error with tts"));
    }

}

async function playCommand(arguments, receivedMessage) {
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
                    const connection = joinVoiceChannel({
                        channelId: receivedMessage.member.voice.channel.id,
                        guildId: receivedMessage.guild.id,
                        adapterCreator: receivedMessage.guild.voiceAdapterCreator,
                        selfMute: false,
                        selfDeaf: false
                    })
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
                    const connection = joinVoiceChannel({
                        channelId: receivedMessage.member.voice.channel.id,
                        guildId: receivedMessage.guild.id,
                        adapterCreator: receivedMessage.guild.voiceAdapterCreator,
                        selfMute: false,
                        selfDeaf: false
                    })
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
        voiceConnection = await voiceConnection.destroy();
    }
    if (!globalInteraction) {
        return;
    } else {
        let interaction = globalInteraction;
        let isVoiceMsg = true;
        msgStatus = "standby";
        setTimeout(() => { checkMsg(receivedMessage, isVoiceMsg) }, 500);
    }    
}

const video_player = async (guild, song, receivedMessage) => {
    const song_queue = queue.get(guild.id);
    
    if (!song) {
        queue.delete(guild.id);
        return;
    }

    const stream = createAudioResource(ytdl(song.url, { filter: 'audioonly', volume: 2 }));
    player.play(stream);
    
    await client.channels.cache.get(botCommands).send(`‎\n█▄░█ █▀█ █░█░█   █▀█ █░░ ▄▀█ █▄█ █ █▄░█ █▀▀\n█░▀█ █▄█ ▀▄▀▄▀   █▀▀ █▄▄ █▀█ ░█░ █ █░▀█ █▄█\n**_${song.title}_** ${wApo}〈${song.duration.timestamp}〉${wApo}`)

    player.on(AudioPlayerStatus.Idle, () => {
        if (!server_queue || server_queue.songs.length === 0) {
            queue.delete(receivedMessage.guild.id);
            server_queue = queue.get(receivedMessage.guild.id);
            return;
        } else {
            server_queue.songs.shift();
            player.play(getNextResource("", receivedMessage));
        }
    });

    player.on('error', error => {
        console.error("Playback error");
        skipCommand("", receivedMessage);
    });
    
}

const getNextResource = (args, receivedMessage) => {
    return createAudioResource(ytdl(server_queue.songs[0].url, { filter: 'audioonly', volume: 2 }));
}

function noSongsQueued() {
    client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙩𝙝𝙚𝙧𝙚 𝙖𝙧𝙚 𝙣𝙤 𝙨𝙤𝙣𝙜𝙨 𝙦𝙪𝙚𝙪𝙚𝙙 ${wApo}`);
}

const skip_song = (arguments, receivedMessage) => {
    if (!receivedMessage.member.voice.channel) return client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙮𝙤𝙪 𝙣𝙚𝙚𝙙 𝙩𝙤 𝙗𝙚 𝙞𝙣 𝙖 𝙘𝙝𝙖𝙣𝙣𝙚𝙡 𝙩𝙤 𝙪𝙨𝙚 𝙩𝙝𝙞𝙨 𝙘𝙤𝙢𝙢𝙖𝙣𝙙 ${wApo}`)

    if (!server_queue || server_queue.songs.length === 0) {
        player.stop()
        queue.delete(receivedMessage.guild.id);
        server_queue = queue.get(receivedMessage.guild.id);
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
    // queue.delete(receivedMessage.guild.id);
    // server_queue = queue.get(receivedMessage.guild.id);
    client.channels.cache.get(botCommands).send(`‎\n${wApo} 𝙥𝙡𝙖𝙮𝙗𝙖𝙘𝙠 𝙨𝙩𝙤𝙥𝙥𝙚𝙙 ${wApo}`
    );
}

client.on("ready", async () => {
    console.log("Ready!");
    //client.user.setStatus("dnd");
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
                player.play(resource);
                player.on(AudioPlayerStatus.Playing, () => {
                        // Do whatever you need to do when playing
                });
                voiceConnection.subscribe(player);
            }
        }
    } catch {console.log("Error joining voice channel");}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;
    globalInteraction = interaction;
    if (interaction.customId === 'join') {
        if (interaction.member.voice.channel){
            await interaction.deferUpdate();
            await wait(100);
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
        leaveCommand();
    }
});

client.login(secret);