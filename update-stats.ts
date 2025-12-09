import {Client, Events, GatewayIntentBits} from "discord.js";
import dotenv = require("dotenv");
import fs = require("fs");
import path = require("path");

dotenv.config();

const client: any = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async () => {
    console.log(`ログインしました: ${client.user?.tag}`);
    const guildCount = client.guilds.cache.size;
    console.log(`導入サーバー数: ${guildCount}`);

    // GitHub Pages用のJSONファイルを生成
    const stats = {
        schemaVersion: 1,
        label: "servers",
        message: guildCount.toString(),
        color: "blue"
    };

    const docsDir = path.join(__dirname, "docs");
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir);
    }

    fs.writeFileSync(
        path.join(docsDir, "stats.json"),
        JSON.stringify(stats, null, 2)
    );

    console.log("stats.jsonを更新しました");
    process.exit(0);
});

client.login(process.env.DISCORD_TOKEN).then();
