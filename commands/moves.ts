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
        .setDescription("Move multiple specified users to a voice channel.")
        .addChannelOption((option: SlashCommandChannelOption) =>
            option
                .setName("destination")
                .setDescription("Destination channel name (e.g. General)")
                .addChannelTypes(2)
                .setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("user1").setDescription("User to move 1").setRequired(true)
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("user2").setDescription("User to move 2")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("user3").setDescription("User to move 3")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("user4").setDescription("User to move 4")
        ).addUserOption((option: SlashCommandUserOption) =>
            option.setName("user5").setDescription("User to move 5")
        ),

    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const channel = options.getChannel("destination") as VoiceBasedChannel;

        const getUser = (n: number) => options.getUser(`user${n}`) as User | null;
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
