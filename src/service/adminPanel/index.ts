import { ActionRowBuilder, ButtonBuilder, Collection, ModalActionRowComponent, Snowflake } from 'discord.js';

import { ButtonStyle } from 'discord-api-types/v10';

import { IdToCtxChannel } from '../../root/Util';
import Blacklisting from './Blacklisting';
import { Monitoring } from './Monitoring';
import SuperClient from '../../root/SuperClient';
import Context from '../../root/Context';

/**
 * An empty button for the panel.
 *
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
export const emptyButton = (id: string): ButtonBuilder =>
  new ButtonBuilder().setStyle(ButtonStyle['Secondary']).setDisabled(true).setCustomId(id).setEmoji('▪️');

/**
 * Generate the rows from the panel buttons list.
 *
 * @param buttons The buttons to display.
 * @returns The buttons list.
 */
export function generatePanelRows(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder>[] {
  const actionsRows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let i: number = 0; i < buttons.length; i++) {
    if (i % 5 === 0) actionsRows.push(new ActionRowBuilder());
    actionsRows[actionsRows.length - 1].addComponents(buttons[i]);
  }
  for (let j: number = actionsRows[actionsRows.length - 1].components.length; j < 5; j++)
    actionsRows[actionsRows.length - 1].addComponents(emptyButton(String(j)));

  return actionsRows;
}

/**
 * The interface that represents the formatted data to a validation function.
 */
export interface TestedModalSubitFields {
  /**
   * If the form is valid.
   */
  valid: boolean;
  /**
   * The values of the field.
   */
  data: Collection<string, ModalActionRowComponent>;
  /**
   * The list of errors.
   */
  errors: string[];
  /**
   * Entry name. The user username or the guild name. Only if available.
   */
  name: string;
}

/**
 * The default class of the file.
 * Includes useful methods for getting assets.
 */
export class Index {
  /**
   * Client instance.
   */
  public client: SuperClient;
  /**
   * The context of the action.
   */
  public ctx: Context;

  /**
   * @param client The client instance.
   */
  constructor(client: SuperClient) {
    this.client = client;
  }

  /**
   * Generate a blacklisting panel.
   */
  get blacklisting(): Blacklisting {
    return new Blacklisting(this.client, this.ctx);
  }

  /**
   * Generate a monitoring panel.
   */
  get monitoring(): Monitoring {
    return new Monitoring(this.client, this.ctx);
  }
}

/**
 * The channel of the context.
 *
 * @param client The client.
 * @param guildId The channel of the context.
 * @param channelId The guild of the context.
 * @returns An index instance.
 */
export default async function index(client: SuperClient, guildId: Snowflake, channelId: Snowflake): Promise<Index> {
  const indexInstance: Index = new Index(client);
  indexInstance.ctx = new Context(await IdToCtxChannel(client, guildId, channelId), null, null, client.user);

  return indexInstance;
}
