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
import {i18n} from "../utils/i18n";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teams")
        .setDescription("Divide into teams and move to voice channels.")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("team1")
                .setDescription("Destination channel for Team 1 (e.g. General)")
                .addChannelTypes(2)
                .setRequired(true)
        ).addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("team2")
                .setDescription("Destination channel for Team 2 (e.g. Lobby)")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option
                .setName("exclude-member")
                .setDescription("Member to exclude from team division")
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channel1 = options.getChannel("team1") as VoiceBasedChannel;
        const channel2 = options.getChannel("team2") as VoiceBasedChannel;
        const excludeMember = options.getUser("exclude-member");

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
        const locale = i18n.getLocale(interaction.locale);

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
                    .setLabel(i18n.t("commands.teams.button", locale))
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