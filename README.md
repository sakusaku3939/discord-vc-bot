# Discord VCチャンネル移動bot

[[For the English version]](https://github.com/sakusaku3939/discord-vc-bot/blob/master/README_EN.md)

![導入サーバー数](https://img.shields.io/badge/dynamic/json?url=https://sakusaku3939.github.io/discord-vc-bot/stats.json&query=message&label=%E5%B0%8E%E5%85%A5%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E6%95%B0&color=green)

ユーザーを指定してボイスチャンネルを移動することができるDiscordボットです。  
複数ユーザーやチャンネルごとの移動にも対応しています。

[→ Discordに追加する](https://discord.com/api/oauth2/authorize?client_id=1044007415680598068&permissions=2164262912&scope=bot%20applications.commands)

![vc-bot](https://user-images.githubusercontent.com/53967490/204147634-c96a0a1c-a938-457f-afda-93d12533b453.gif)

# 機能

- **ボイスチャンネル管理**： ユーザーをボイスチャンネル間で移動する
- **チーム分け**： ユーザーをランダムにチーム分けする
- **スマブラキャラ選択**： スマブラSPのキャラクターをランダムに選出する（チームビンゴ用のおまけ機能）

# 使い方

> ユーザーを指定してボイスチャンネルを移動
```
/moves (移動先チャンネル) (ユーザー1) (ユーザー2) ・・・
```

> ボイスチャンネルを指定してその中にいるメンバー全員を移動
```
/channel (移動元チャンネル) (移動先チャンネル)
```

> 全てのボイスチャンネルから指定のチャンネルにメンバーを集める

```
/gather [集合先チャンネル]
```

> チーム分けをしてボイスチャンネルを移動

```
/teams (チーム1チャンネル) (チーム2チャンネル) [除外メンバー]
```

> スマブラのキャラクターをランダムに選択

```
/character (チーム1のキャラクター数) (チーム2のキャラクター数) [Miiファイターを除外]
```

# カスタマイズする場合

※ Node v16.9.0 以降が必要です。

```
git clone https://github.com/sakusaku3939/discord-vc-bot.git
cd discord-vc-bot
```
```
npm install
```

[Discord Developer Portal](https://discord.com/developers/applications) から新しいアプリケーションを作成し、トークンを
`DISCORD_TOKEN` に貼り付けます。
```
echo 'DISCORD_TOKEN="(BOTトークン)"' > .env
```

以下のコマンドで開始できます。
```
ts-node server.ts
```

# License
[MIT](https://github.com/sakusaku3939/remove-slideshare-limit/blob/master/LICENSE)
