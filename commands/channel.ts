import {CommandInteraction, SlashCommandBuilder, SlashCommandChannelOption, VoiceBasedChannel} from "discord.js";

import {errorChannelReply, successChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("Move all members in a specified voice channel.")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("destination")
                .setDescription("Destination channel name (e.g. General)")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("source")
                .setDescription("Source channel name (e.g. Lobby)")
                .addChannelTypes(2)
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channelTo = options.getChannel("destination") as VoiceBasedChannel;
        let channelFrom = options.getChannel("source") as VoiceBasedChannel;

        const currentChannel = (interaction.member as any).voice.channel;
        channelFrom = channelFrom ?? currentChannel;

        if (channelFrom == null) {
            await errorChannelReply(interaction)
            return;
        }

        for (const member of channelFrom.members.values()) {
            await member.voice.setChannel(channelTo);
        }

        await successChannelReply(interaction, channelFrom, channelTo);
    },
}