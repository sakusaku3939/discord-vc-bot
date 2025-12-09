import {ButtonInteraction, CommandInteraction, DiscordAPIError, VoiceBasedChannel} from "discord.js";
import {i18n} from "./i18n";

export async function successReply(interaction: CommandInteraction, member: any, channel: VoiceBasedChannel) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply(i18n.t("commands.moves.success", locale, {channel: channel.name}));
}

export async function successChannelReply(interaction: CommandInteraction, channelFrom: VoiceBasedChannel, channelTo: VoiceBasedChannel) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply(i18n.t("commands.channel.success", locale, {from: channelFrom.name, to: channelTo.name}));
}

export async function successMoveReply(interaction: ButtonInteraction) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply({
        content: i18n.t("common.moved", locale),
        ephemeral: true
    });
}

export async function errorReply(interaction: CommandInteraction | ButtonInteraction, e: any) {
    console.error(e);
    const locale = i18n.getLocale(interaction.locale);
    const errorMsg = e instanceof DiscordAPIError ? `${e.code}` : "-1";
    await interaction.reply({
        content: i18n.t("common.error", locale, {error: errorMsg}),
        ephemeral: true
    });
}

export async function errorConnectReply(interaction: CommandInteraction) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply({
        content: i18n.t("commands.moves.error", locale),
        ephemeral: true
    });
}

export async function errorChannelReply(interaction: CommandInteraction | ButtonInteraction) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply({
        content: i18n.t("commands.channel.error", locale),
        ephemeral: true
    });
}

export async function errorLackPeopleReply(interaction: CommandInteraction) {
    const locale = i18n.getLocale(interaction.locale);
    await interaction.reply({
        content: i18n.t("commands.teams.errorPeople", locale),
        ephemeral: true
    });
}