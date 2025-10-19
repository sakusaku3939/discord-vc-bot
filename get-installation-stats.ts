import {Client, Events, GatewayIntentBits} from "discord.js";
import dotenv = require("dotenv");

dotenv.config();

const client: any = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async () => {
    console.log(`ログインしました: ${client.user?.tag}`);
    const guildCount = client.guilds.cache.size;
    console.log(`導入サーバー数: ${guildCount}`);
});

client.login(process.env.DISCORD_TOKEN).then();
