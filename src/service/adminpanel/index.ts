import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  Collection,
  Guild,
  InteractionResponse,
  Message,
  Snowflake,
} from 'discord.js';

import { ButtonStyle } from 'discord-api-types/v10';

import Client from '../../root/Client';
import { caught, SFToCtxChannel } from '../../root/Util';
import Context from '../../root/Context';

/*
 * Display number of users, servers and players
 * Display premium stats
 * Display blacklist
 */

/**
 * An empty button for the panel.
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
export const emptyButton = (id: string): ButtonBuilder =>
  new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)
    .setCustomId(`autodefer_adminpanel_${id}`)
    .setEmoji('▪️');

/**
 * The list of buttons for the panel.
 */
export const panelButtons: ButtonBuilder[] = [
  new ButtonBuilder()
    .setEmoji('<:refresh:1141781454511149196>')
    .setCustomId('autodefer_adminpanel_refresh')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setEmoji('<:ping:1141781630709665962>')
    .setCustomId('autodefer_adminpanel_ping')
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setEmoji('<:blacklist:1141782168910180362>')
    .setCustomId('autodefer_adminpanel_blacklist')
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setEmoji('<:settings:1141782142339260416>')
    .setCustomId('autodefer_adminpanel_settings')
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setEmoji('<:flag:1141782136333017129>')
    .setCustomId('autodefer_adminpanel_status')
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setEmoji('<:premium:1141782866578116700>')
    .setCustomId('autodefer_adminpanel_premium')
    .setStyle(ButtonStyle.Success),
];

/**
 * Generate the rows from the panel buttons list.
 */
export function generatePanelRows(): ActionRowBuilder<ButtonBuilder>[] {
  const actionsRows: ActionRowBuilder<ButtonBuilder>[] = [];
  for (let i: number = 0; i < panelButtons.length; i++) {
    if (i % 5 === 0) actionsRows.push(new ActionRowBuilder());
    actionsRows[actionsRows.length - 1].addComponents(panelButtons[i]);
  }
  for (let j: number = actionsRows[actionsRows.length - 1].components.length; j < 5; j++)
    actionsRows[actionsRows.length - 1].addComponents(emptyButton(String(j)));

  return actionsRows;
}

/**
 * The default class of the file.
 * Includes useful methods for getting assets.
 */
export class Index {
  /**
   * The client of the service.
   */
  public client: Client;
  /**
   * The guild where the admin panel is sent.
   */
  public guild: Guild;
  /**
   * The message where the admin panel is sent.
   */
  public message: InteractionResponse | Message;
  /**
   * The context of the admin panel.
   */
  public ctx: Context;

  /**
   * @param client The client.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Resend/edit the panel to update information.
   * @returns Nothing.
   */
  public async refreshChannel(): Promise<void | Message> {
    const messages: void | Collection<string, Message> = await this.ctx.channel.messages.fetch().catch(caught);
    if (!messages) return;

    const payload: BaseMessageOptions = {
      content: 'Testing panel',
      components: generatePanelRows(),
    };
    if (!messages.first()) await this.ctx.send(payload);
    else await this.ctx.edit(payload, messages.first(), false);
  }
}

/**
 * The channel of the context.
 * @param client The client.
 * @param channel The channel of the context.
 * @param guild The guild of the context.
 * @returns Nothing.
 */
export default async function index(client: Client, channel: Snowflake, guild: Snowflake): Promise<Index> {
  const indexInstance: Index = new Index(client);
  indexInstance.ctx = new Context(await SFToCtxChannel(client, guild, channel), null, null, client.user);
  indexInstance.guild = (await client.guilds.fetch(guild).catch(caught)) || null;

  return indexInstance;
}
