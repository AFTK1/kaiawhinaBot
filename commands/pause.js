const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)
		const row = new MessageActionRow();
		const currentSong = queue.current
		
		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.setPaused(true)
        await interaction.editReply("Music has been paused! Use `/resume` to resume the music")

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
                new MessageEmbed().setDescription("Music has been paused!").setThumbnail(currentSong.thumbnail)
            ],
            components: [row]
        })
	},
}