const { Client } = require('discord.js-selfbot-v13');
const { discordtoken } = require('./config.json');
const addFriend = require('./Commands/addFriend.js');
var clc = require("cli-color");

const client = new Client({
    checkUpdate: false,
});

client.on('ready', async () => {
    process.stdout.write(clc.erase.screen);
    process.stdout.write(clc.move.top);
    var logo = clc.xterm(239);
    console.log(logo(`

    
    ███╗   ███╗ ██████╗  ██████╗     ███████╗███╗   ██╗██╗██████╗ ███████╗██████╗     
    ████╗ ████║██╔════╝ ██╔═══██╗    ██╔════╝████╗  ██║██║██╔══██╗██╔════╝██╔══██╗    
    ██╔████╔██║██║  ███╗██║   ██║    ███████╗██╔██╗ ██║██║██████╔╝█████╗  ██████╔╝    
    ██║╚██╔╝██║██║   ██║██║   ██║    ╚════██║██║╚██╗██║██║██╔═══╝ ██╔══╝  ██╔══██╗    
    ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝    ███████║██║ ╚████║██║██║     ███████╗██║  ██║    
    ╚═╝     ╚═╝ ╚═════╝  ╚═════╝     ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   [v1.0.0]  
    `))

  console.log('\n\nClient: ' + clc.red.bold(client.user.username) + ` (${client.user.id})` + ' is listening for links...');
})

client.on('messageCreate', async (message) => {
    const linkFilter = /https?:\/\/www\.facebook\.com\/profile\.php\?id=\d+/g;
    const targetFound = message.content.match(linkFilter);
    let runningCount = 0;
    if (targetFound) {
        for (const link of targetFound) {
            runningCount++;
            console.log(clc.yellow.bold(`[Task #${runningCount}]`) + ` Target Link found in Channel ${message.channel.name}: ` + clc.blueBright(link));
            await addFriend(link).catch (err => console.log(err));
        }
    }
});


client.login(discordtoken);