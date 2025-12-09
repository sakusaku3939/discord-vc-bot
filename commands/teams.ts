import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandUserOption,
    User,
    VoiceBasedChannel
} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";

import {errorChannelReply, errorLackPeopleReply} from "../utils/reply";
import {shuffle} from "../utils/shuffle";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teams")
        .setDescription("チーム分けをしてボイスチャンネルを移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("チーム1")
                .setDescription("チーム1の移動先チャンネル（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("チーム2")
                .setDescription("チーム2の移動先チャンネル（例. ロビー）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("除外メンバー")
                .setDescription("チーム分けで除外するメンバー")
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channel1 = options.getChannel("チーム1") as VoiceBasedChannel;
        const channel2 = options.getChannel("チーム2") as VoiceBasedChannel;
        const excludeMember = options.getUser("除外メンバー");

        let currentChannel = (interaction.member as any).voice.channel;
        if (currentChannel == null) {
            await errorChannelReply(interaction);
            return;
        }

        const members = currentChannel.members.filter((m: User) => m.id !== excludeMember?.id)
        if (members.size < 2) {
            await errorLackPeopleReply(interaction);
            return;
        }

        const shuffleMembers = shuffle(members.values());
        const half = splitHalf(shuffleMembers);

        const embed1 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(channel1.name)
            .setDescription(half[0].toString());

        const embed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(channel2.name)
            .setDescription(half[1].toString());

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("moveChannel")
                    .setLabel("チャンネルを移動する")
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({
            embeds: [embed1, embed2],
            components: [row as any],
        });
    },
}

function splitHalf(array: any): Array<any> {
    const half = Math.ceil(array.length / 2);
    const firstHalf = array.splice(0, half);
    const secondHalf = array.splice(-half);
    return [firstHalf, secondHalf];
}