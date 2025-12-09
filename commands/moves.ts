import {
    Collection,
    CommandInteraction,
    DiscordAPIError,
    GuildMember,
    SlashCommandBuilder,
    SlashCommandUserOption,
    User,
    VoiceBasedChannel
} from "discord.js";
import {SlashCommandChannelOption} from "@discordjs/builders";
import {errorConnectReply, errorReply, successReply} from "../utils/reply";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("moves")
        .setDescription("複数人のユーザーを指定してボイスチャンネルを移動します。")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("移動先")
                .setDescription("移動先チャンネルの名称（例. 一般）")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("ユーザー1").setDescription("移動するユーザーの名前1").setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("ユーザー2").setDescription("移動するユーザーの名前2")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("ユーザー3").setDescription("移動するユーザーの名前3")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("ユーザー4").setDescription("移動するユーザーの名前4")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("ユーザー5").setDescription("移動するユーザーの名前5")
        ),

    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channel = options.getChannel("移動先") as VoiceBasedChannel;

        const getUser = (n: number) => options.getUser(`ユーザー${n}`) as User | null;
        const movedMembers = new Collection<string, GuildMember>();

        for (let i = 1; i <= 5; i++) {
            const user = getUser(i);
            if (!user) continue;

            try {
                const member = await interaction.guild!.members.fetch(user.id);
                await member.voice.setChannel(channel);
                movedMembers.set(member.id, member);
            } catch (e) {
                if (!(e instanceof DiscordAPIError && e.code === 40032)) {
                    await errorReply(interaction, e);
                }
            }
        }

        if (movedMembers.size > 0) {
            await successReply(interaction, movedMembers.toJSON(), channel);
        } else {
            await errorConnectReply(interaction);
        }
    }
}
