import {Client, Events, GatewayIntentBits} from "discord.js";
import path from "path";
import {i18n} from "./utils/i18n";
import dotenv = require("dotenv");
import fs = require("fs");

dotenv.config();

const client: any = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async () => {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith(".ts"));

    const data = [];
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        const commandData = command.data.toJSON();

        const commandName = commandData.name;
        commandData.description_localizations = {
            "ja": i18n.t(`commands.${commandName}.description`, "ja"),
        };

        if (commandData.options) {
            for (const option of commandData.options) {
                const optionKey = getOptionKey(commandName, option.name);
                if (optionKey) {
                    option.description_localizations = {
                        "ja": i18n.t(`${optionKey}.description`, "ja"),
                    };
                }
            }
        }

        data.push(commandData);
    }

    await client.application.commands.set(data);
    console.log("Successfully reloaded application (/) commands.");
});

function getOptionKey(commandName: string, optionName: string): string | null {
    const optionMap: { [key: string]: { [key: string]: string } } = {
        "channel": {
            "destination": "commands.channel.options.to",
            "source": "commands.channel.options.from",
        },
        "character": {
            "team1-characters": "commands.character.options.team1",
            "team2-characters": "commands.character.options.team2",
            "exclude-mii-fighters": "commands.character.options.excludeMii",
        },
        "moves": {
            "destination": "commands.moves.options.channel",
        },
        "teams": {
            "team1": "commands.teams.options.team1",
            "team2": "commands.teams.options.team2",
            "exclude-member": "commands.teams.options.exclude",
        },
    };

    if (commandName === "moves" && optionName.startsWith("user")) {
        return "commands.moves.options.user";
    }

    return optionMap[commandName]?.[optionName] || null;
}

client.login(process.env.DISCORD_TOKEN).then();
