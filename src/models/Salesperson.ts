import { Schema, model, Types } from 'mongoose';

/**
 * The interface of a money contract on the economy system.
 */
export interface MoneyContract {
  /**
   * The id of the contract.
   */
  id: string;
  /**
   * The date when the user passed the contract.
   */
  date: number;
  /**
   * If the player is the loaner or the receiver.
   */
  position: 'loaner' | 'receiver';
  /**
   * The amount loaned or received.
   */
  amount: number;
  /**
   * The amount to receive back or give back.
   */
  compensation: number;
  /**
   * The last date where the loaner can possibly give money back, otherwise he'll pay much more.
   */
  lastDate: number;
  /**
   * The punishment if the receiver doesn't give money back in time.
   */
  charges: number;
}

/**
 * The interface of a document.
 */
export interface Interface {
  /**
   * The player mongoose id.
   */
  id: Types.ObjectId;
  /**
   * The Discord id of the user.
   */
  discordId: string;
  /**
   * The Discord id of the guild.
   */
  guildId: string;
  /**
   * The amount in cash of the user.
   */
  cash: number;
  /**
   * The amount in the safe of the user.
   */
  safe: number;
  /**
   * The contracts passed by the user with another player. It concerns money loan.
   */
  contracts: Record<string, MoneyContract>;
}

/**
 * The mongo schema for the interface.
 */
export const schema = new Schema<Interface>({});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('Salesperson', schema);

/**
 * The default data.
 */
export const { id, ...defaultData }: Interface = {
  id: null,
  discordId: '539842701592494111',
  guildId: '1140221636507869255',
  cash: 0,
  safe: 0,
  contracts: {},
};

/**
 * The primary key of the table.
 */
export const PRIMARY_KEY: string = 'discordId+guildId' as const;
