import {Client, Events, GatewayIntentBits} from "discord.js";
import dotenv = require("dotenv");
import fs = require("fs");
import path from "path";

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
        data.push(command.data.toJSON());
    }

    await client.application.commands.set(data);
    console.log("Successfully reloaded application (/) commands.");
});

client.login(process.env.DISCORD_TOKEN).then();
