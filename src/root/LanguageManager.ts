import SuperClient from './SuperClient';
import fr from './strings/Fr';
import en from './strings/En';
import { Language } from '../service/game/Typings';

/**
 * The default type for a language translation file.
 */
export type LanguageContent = Record<string, (string | RegExp)[] | string>;

/**
 * All the language content.
 */
export const Languages = {
  fr,
  en,
} as const;

/**
 * The class that manages the translations in the project.
 */
export default class LanguageManager {
  /**
   * The client instance.
   */
  public readonly client: SuperClient;

  /**
   * The constructor of the language manager.
   *
   * @param client The client instance.
   */
  constructor(client: SuperClient) {
    this.client = client;
  }

  /**
   * Get a string from the root.
   *
   * @param key The string to get the translation from.
   * @param languageId The language to get the translation from.
   * @returns The translated string.
   */
  public getStr(key: keyof LanguageContent, languageId: Language): LanguageContent[Language] {
    return Languages[languageId][key];
  }
}
