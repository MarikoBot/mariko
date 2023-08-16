"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Languages = void 0;
const Fr_1 = require("./strings/Fr");
const En_1 = require("./strings/En");
/**
 * All the language content.
 */
exports.Languages = {
    fr: Fr_1.default,
    en: En_1.default,
};
/**
 * The class that manages the translations in the project.
 */
class LanguageManager {
    /**
     * The client instance.
     */
    client;
    /**
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Get a string from the root.
     * @param key The string to get the translation from.
     * @param languageId The language to get the translation from.
     * @returns The translated string.
     */
    getStr(key, languageId) {
        return exports.Languages[languageId][key];
    }
}
exports.default = LanguageManager;
