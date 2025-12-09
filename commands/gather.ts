import {
    CommandInteraction,
    DiscordAPIError,
    GuildMember,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    VoiceBasedChannel
} from "discord.js";
import {errorChannelReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gather")
        .setDescription("全てのボイスチャンネルから指定のチャンネルにメンバーを集めます。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("集合先")
                .setDescription("集合先チャンネルの名称（指定しない場合は現在のチャンネル）")
                .addChannelTypes(2)
        ),

    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        let targetChannel = options.getChannel("集合先") as VoiceBasedChannel | null;

        // 集合先が指定されていない場合は、コマンド実行者の現在のボイスチャンネルを使用
        const currentChannel = (interaction.member as any).voice.channel;
        targetChannel = targetChannel ?? currentChannel;

        if (targetChannel == null) {
            await errorChannelReply(interaction);
            return;
        }

        const allChannels = await interaction.guild!.channels.fetch();
        const allVoiceChannels = allChannels.filter(c => c?.type === 2);

        let movedCount = 0;
        const movedMembers: GuildMember[] = [];

        for (const [, channel] of allVoiceChannels) {
            if (!channel || channel.id === targetChannel.id) continue;

            const voiceChannel = channel as VoiceBasedChannel;
            for (const [, member] of voiceChannel.members) {
                try {
                    await member.voice.setChannel(targetChannel);
                    movedMembers.push(member);
                    movedCount++;
                } catch (e) {
                    if (!(e instanceof DiscordAPIError && e.code === 40032)) {
                        console.error(`Failed to move ${member.user.tag}:`, e);
                    }
                }
            }
        }

        if (movedCount > 0) {
            const memberMentions = movedMembers.map(m => `<@${m.id}>`).join(", ");
            await interaction.reply(
                `${memberMentions} を ${targetChannel} チャンネルに集めました（${movedCount}人）`
            );
        } else {
            await interaction.reply({
                content: "移動対象のメンバーがいませんでした",
                ephemeral: true
            });
        }
    }
}
