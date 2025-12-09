import {ButtonInteraction, CommandInteraction, DiscordAPIError, VoiceBasedChannel} from "discord.js";

export async function successReply(interaction: CommandInteraction, member: any, channel: VoiceBasedChannel) {
    await interaction.reply(`${[member]} を ${[channel]} チャンネルに移動しました`);
}

export async function successChannelReply(interaction: CommandInteraction, channelFrom: VoiceBasedChannel, channelTo: VoiceBasedChannel) {
    await interaction.reply(`${[channelFrom]} から ${[channelTo]} チャンネルに移動しました`);
}

export async function successMoveReply(interaction: ButtonInteraction) {
    await interaction.reply({
        content: "ボイスチャンネルを移動しました",
        ephemeral: true
    });
}

export async function errorReply(interaction: CommandInteraction | ButtonInteraction, e: any) {
    console.error(e);
    if (e instanceof DiscordAPIError) {
        await interaction.reply({
            content: `エラー (${e.code})： ボイスチャンネルの移動に失敗しました`,
            ephemeral: true
        });
    } else {
        await interaction.reply({
            content: "エラー (-1)： ボイスチャンネルの移動に失敗しました",
            ephemeral: true
        });
    }
}

export async function errorConnectReply(interaction: CommandInteraction) {
    await interaction.reply({
        content: "エラー (40032)： 対象ユーザーがボイスチャンネルに接続されていません",
        ephemeral: true
    });
}

export async function errorChannelReply(interaction: CommandInteraction | ButtonInteraction) {
    await interaction.reply({
        content: "エラー (40000)： ボイスチャンネルに接続する必要があります",
        ephemeral: true
    });
}

export async function errorLackPeopleReply(interaction: CommandInteraction) {
    await interaction.reply({
        content: "エラー (40001)： 2人以上のユーザーがボイスチャンネルに接続している必要があります",
        ephemeral: true
    });
}