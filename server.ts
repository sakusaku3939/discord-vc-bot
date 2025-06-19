import {
    Client,
    Interaction,
    GatewayIntentBits,
    Collection,
    Events,
    DiscordAPIError, VoiceBasedChannel, ButtonStyle
} from "discord.js";
import dotenv = require("dotenv");
import fs = require("fs");
import path from "path";
import {errorReply, successMoveReply} from "./utils/reply";

dotenv.config();

const client: any = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

client.once(Events.ClientReady, (c: Client) => {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    console.log(`Ready! Logged in as ${c.user?.tag}`);
    console.log(`導入されているサーバー数: ${client.guilds.cache.size}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isButton() && interaction.customId === "moveChannel") {
        let users: { [p: string]: string } = {};

        for (const embed of interaction.message.embeds) {
            const members = embed.data.description ?? "";
            const channel = embed.data.title ?? "";
            for (const member of members.split(",")) {
                users[member] = channel;
            }
        }

        const allMembers = await interaction.guild!.members.fetch();
        const allChannels = await interaction.guild!.channels.fetch();
        const allVoiceChannels = allChannels.filter(c => c?.type == 2);
        const members = allMembers.filter(m => Object.keys(users).includes(`<@${m.id.toString()}>`));

        for (const member of members.values()) {
            try {
                const channel = allVoiceChannels.filter(c =>
                    users[`<@${member.id.toString()}>`].includes(<string>c?.name.toString())
                ).first();
                await member.voice.setChannel(channel as VoiceBasedChannel);
            } catch (e) {
                if (!(e instanceof DiscordAPIError && e.code === 40032)) {
                    await errorReply(interaction, e);
                }
            }
        }
        await successMoveReply(interaction);
    }
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        await errorReply(interaction, e);
    }
});

client.login(process.env.DISCORD_TOKEN).then();