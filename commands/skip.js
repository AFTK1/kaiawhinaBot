const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
        const row = new MessageActionRow();

		if (!queue) return await interaction.editReply("There are no songs in the queue")
        
        const skippedSong = queue.current    
		await queue.skip()
        const currentSong = queue.tracks[0]
        
        row
        .addComponents(					
            new MessageButton()
                .setCustomId('pause')
                .setLabel('Pause')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('resume')
                .setLabel('Resume')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('skip')
                .setLabel('Skip')
                .setStyle('PRIMARY'),
        );
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${skippedSong.title} has been skipped! Now playing ${currentSong.title} by ${currentSong.author}`).setThumbnail(currentSong.thumbnail)
            ],
            components: [row]
        })
	},
}