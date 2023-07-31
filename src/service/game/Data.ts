// noinspection JSUnusedGlobalSymbols

import { Skill, Way, Weapon } from './Typings';

/**
 * The weapons added values of the game.
 */
export const weaponsAddedValues: Record<Weapon, [Skill, Skill]> = {
  katana: ['durability', 'synergy'],
  poisonedKatana: ['synergy', 'strength'],
  flailWithAxe: ['strength', 'speed'],
  undulatingKatana: ['speed', 'strength'],
  whippingKatana: ['synergy', 'durability'],
  twinBlades: ['speed', 'collection'],
  laceratingKatanas: ['strength', 'speed'],
  fleshyShotgun: ['speed', 'collection'],
};

/**
 * The main skill, bonus and malus of each way.
 */
export const waySkills: Record<Way, Skill[]> = {
  warrior: ['strength', 'durability', 'speed', 'recovery'],
  strategist: ['synergy', 'mental', 'speed', 'collection'],
  agile: ['endurance', 'speed', 'strength', 'recovery'],
  goliath: ['collection', 'strength', 'synergy', 'endurance'],
  ninja: ['speed', 'synergy', 'strength', 'durability'],
};

/**
 * The emoji of each way.
 */
export const wayEmojis: Record<Way, string> = {
  warrior: '👺',
  strategist: '🧪',
  agile: '🔪',
  goliath: '🪓',
  ninja: '🥷',
} as const;
