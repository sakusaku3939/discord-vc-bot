import {CommandInteraction, SlashCommandBuilder, SlashCommandChannelOption, VoiceBasedChannel} from "discord.js";

import {errorChannelReply, successChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("channel")
        .setDescription("ボイスチャンネルを指定して、その中にいるメンバー全員を移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("移動先")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("移動元")
                .setDescription("移動元チャンネルの名称（例. ロビー）")
                .addChannelTypes(2)
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channelTo = options.getChannel("移動先") as VoiceBasedChannel;
        let channelFrom = options.getChannel("移動元") as VoiceBasedChannel;

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