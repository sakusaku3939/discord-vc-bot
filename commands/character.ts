import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandNumberOption
} from "discord.js";
import {shuffle} from "../utils/shuffle";
import {i18n} from "../utils/i18n";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("character")
        .setDescription("Randomly select Smash Bros characters")
        .addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("team1-characters")
                .setDescription("Number of characters for Team 1")
                .setRequired(true)
        ).addNumberOption((option: SlashCommandNumberOption) =>
            option
                .setName("team2-characters")
                .setDescription("Number of characters for Team 2")
                .setRequired(true)
        ).addBooleanOption((option: SlashCommandBooleanOption) =>
            option
                .setName("exclude-mii-fighters")
                .setDescription("Exclude Mii Brawler, Mii Swordfighter, and Mii Gunner")
        ),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;
        const options = interaction.options;
        const num1 = options.getNumber("team1-characters");
        const num2 = options.getNumber("team2-characters");
        const mii = options.getBoolean("exclude-mii-fighters");

        let characters = ['マリオ', 'ドンキーコング', 'リンク', 'サムス', 'ダークサムス', 'ヨッシー', 'カービィ', 'フォックス', 'ピカチュウ', 'ルイージ', 'ネス', 'キャプテン・ファルコン', 'プリン', 'ピーチ', 'デイジー', 'クッパ', 'アイスクライマー', 'シーク', 'ゼルダ', 'ドクターマリオ', 'ピチュー', 'ファルコ', 'マルス', 'ルキナ', 'こどもリンク', 'ガノンドロフ', 'ミュウツー', 'ロイ', 'クロム', 'Mr.ゲーム＆ウォッチ', 'メタナイト', 'ピット', 'ブラックピット', 'ゼロスーツサムス', 'ワリオ', 'スネーク', 'アイク', 'ポケモントレーナー', 'ディディーコング', 'リュカ', 'ソニック', 'デデデ', 'ピクミン＆オリマー', 'ルカリオ', 'ロボット', 'トゥーンリンク', 'ウルフ', 'むらびと', 'ロックマン', 'WiiFitトレーナー', 'ロゼッタ＆チコ', 'リトル・マック', 'ゲッコウガ', 'パルテナ', 'パックマン', 'ルフレ', 'シュルク', 'クッパJr.', 'ダックハント', 'リュウ', 'ケン', 'クラウド', 'カムイ', 'ベヨネッタ', 'インクリング', 'リドリー', 'シモン', 'リヒター', 'キングクルール', 'しずえ', 'ガオガエン', 'パックンフラワー', 'ジョーカー', '勇者', 'バンジョー＆カズーイ', 'テリー', 'ベレト', 'ミェンミェン', 'スティーブ', 'セフィロス', 'ホムラ／ヒカリ', 'カズヤ', 'ソラ'];
        const miiCharacters = ['Miiファイター格闘', 'Miiファイター剣術', 'Miiファイター射撃']

        if (mii !== true) {
            characters = characters.concat(miiCharacters)
        }

        const shuffle1 = shuffle(characters).slice(0, num1!);
        const shuffle2 = shuffle(characters).slice(0, num2!);

        const locale = i18n.getLocale(interaction.locale);

        const embed1 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(i18n.t("commands.character.team1", locale))
            .setDescription(shuffle1.toString().replaceAll(",", ", "));

        const embed2 = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(i18n.t("commands.character.team2", locale))
            .setDescription(shuffle2.toString().replaceAll(",", ", "));

        await interaction.reply({
            embeds: [embed1, embed2],
        });
    },
}
