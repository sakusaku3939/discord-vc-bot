# Discord VC channel moving bot

![Server Count](https://img.shields.io/badge/dynamic/json?url=https://sakusaku3939.github.io/discord-vc-bot/stats.json&query=message&label=Server%20Count&color=green)
<br>

This is a Discord bot that allows you to move voice channels by specifying users.  
It supports moving multiple users and channels.

[→ Add to Discord](https://discord.com/api/oauth2/authorize?client_id=1044007415680598068&permissions=2164262912&scope=bot%20applications.commands)

![vc-bot](https://user-images.githubusercontent.com/53967490/204147634-c96a0a1c-a938-457f-afda-93d12533b453.gif)

# Features

- **Voice Channel Management**: Move users between voice channels
- **Team Assignment**: Randomly divide users into teams
- **Super Smash Bros. Character Selection**: Randomly select a character from Super Smash Bros. Ultimate

# Usage

> Move voice channel by specifying user

```
/moves (destination channel) (user1) (user2) ・・・
```

> Specify a voice channel and move all members in it

```
/channel (origin channel) (destination channel)
```

> Gather members from all voice channels to a specified channel

```
/gather [destination channel]
```

> Divide into teams and move to voice channels

```
/teams (team1 channel) (team2 channel) [exclude member]
```

> Randomly select Smash Bros characters

```
/character (team1 characters) (team2 characters) [exclude Mii fighters]
```

# If you want to customize

*Requires Node v22.12.0 or later

```
git clone https://github.com/sakusaku3939/discord-vc-bot.git
cd discord-vc-bot
```

```
npm install
```

Create a new application from the [Discord Developer Portal](https://discord.com/developers/applications) and paste the
token into `DISCORD_TOKEN`.

```
echo 'DISCORD_TOKEN="token"' > .env
```

You can start with the following command.

```
ts-node server.ts
```

# License

[MIT](https://github.com/sakusaku3939/remove-slideshare-limit/blob/master/LICENSE)
