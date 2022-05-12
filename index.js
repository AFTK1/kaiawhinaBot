const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { Player } = require("discord-player")

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] 
});

client.commands = new Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.on("ready", () => {
    console.log('Ready!');
})

client.on("messageCreate" , (message) => {
    console.log('message recieved');
    if(message.content == "hi"){
        message.reply("hello");
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand() && !interaction.isButton()) return;

    let command;
    if(interaction.isButton()){
        command = client.commands.get(interaction.customId)
    }
    else{
        command = client.commands.get(interaction.commandName);
    }

	if (!command) return;

	try {
		await interaction.deferReply();
		await command.run({client, interaction});
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);