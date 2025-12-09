import {Locale} from "discord.js";
import fs from "fs";
import path from "path";

type TranslationData = {
    [key: string]: string | TranslationData;
};

type Translations = {
    [locale: string]: TranslationData;
};

class I18n {
    private translations: Translations = {};
    private defaultLocale: string = "ja";

    constructor() {
        this.loadTranslations();
    }

    private loadTranslations() {
        const localesPath = path.join(__dirname, "..", "locales");

        if (!fs.existsSync(localesPath)) {
            console.warn("Locales directory not found");
            return;
        }

        const files = fs.readdirSync(localesPath).filter(file => file.endsWith(".json"));

        for (const file of files) {
            const locale = file.replace(".json", "");
            const filePath = path.join(localesPath, file);
            this.translations[locale] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }
    }

    t(key: string, locale?: string, params?: { [key: string]: string | number }): string {
        const targetLocale = locale || this.defaultLocale;
        const fallbackLocale = this.defaultLocale;

        let translation = this.getNestedTranslation(key, targetLocale);

        if (!translation && targetLocale !== fallbackLocale) {
            translation = this.getNestedTranslation(key, fallbackLocale);
        }

        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }

        if (params) {
            return this.replaceParams(translation, params);
        }

        return translation;
    }

    private getNestedTranslation(key: string, locale: string): string | null {
        const keys = key.split(".");
        let current: any = this.translations[locale];

        for (const k of keys) {
            if (current && typeof current === "object" && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }

        return typeof current === "string" ? current : null;
    }

    private replaceParams(text: string, params: { [key: string]: string | number }): string {
        let result = text;
        for (const [key, value] of Object.entries(params)) {
            result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
        }
        return result;
    }

    getLocale(discordLocale?: string): string {
        if (!discordLocale) return this.defaultLocale;

        const localeMap: { [key: string]: string } = {
            "ja": "ja",
            "en-US": "en",
            "en-GB": "en",
            "ko": "ko",
            "zh-CN": "zh-CN",
            "zh-TW": "zh-TW",
        };

        return localeMap[discordLocale] || this.defaultLocale;
    }
}

export const i18n = new I18n();
