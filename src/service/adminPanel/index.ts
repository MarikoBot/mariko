import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonInteraction,
  Collection,
  EmbedBuilder,
  Guild,
  InteractionResponse,
  Message,
  OAuth2Guild,
  Snowflake,
  User,
} from 'discord.js';

import { ButtonStyle } from 'discord-api-types/v10';

import Client from '../../root/Client';
import { clean, Colors, discordDate, SFToCtxChannel } from '../../root/Util';
import Context from '../../root/Context';
import { SubscriptionsData } from '../../server/UserServer';
import { BlacklistData } from '../../models/Core';
import Blacklist from './panels/blacklist';

/**
 * Get the current panel embed.
 * @param client The client.
 * @param color The color name for the embed.
 * @returns The built embed.
 */
export const mainEmbed = async (client: Client, color?: keyof typeof Colors): Promise<EmbedBuilder> => {
  let colorValue: (typeof Colors)[keyof typeof Colors] = Colors.DARK;
  if (color) colorValue = Colors[color];

  const guilds: Collection<string, Guild | OAuth2Guild> =
    (await client.guilds.fetch().catch(clean)) || new Collection();
  const users: Collection<string, User> = client.users.cache || new Collection();
  const players: number = await client.Server.Player.collectionData.Model.countDocuments().exec();
  const premiums: SubscriptionsData = await client.Server.User.getSubsData();
  const blacklist: BlacklistData[] = (await client.Server.Core.getBlacklist()) as BlacklistData[];

  const incomes: number = premiums.totalIncomes.reduce((a: number, b: number) => a + b, 0);
  const CC = require('currency-converter-lt');
  const converter: typeof CC = new CC();

  // noinspection JSUnresolvedReference
  return new EmbedBuilder()
    .setColor(colorValue)
    .setDescription(`# <:admin:1138783481141395466> Admin Panel\n*Click the refresh button to refresh data.*`)
    .setFields(
      {
        name: 'Guilds',
        value: String(guilds.size),
        inline: true,
      },
      {
        name: 'Users',
        value: String(users.size),
        inline: true,
      },
      {
        name: 'Players',
        value: String(players),
        inline: true,
      },
      {
        name: 'Premium incomes',
        value: `**${incomes}$ (${incomes <= 0 ? 0 : await converter?.convert(incomes, 'USD', 'EUR')}€)**/m`,
        inline: true,
      },
      {
        name: 'Blacklist',
        value: `**${blacklist.length}** elements`,
        inline: true,
      },
    )
    .setTimestamp(Date.now())
    .setFooter({ text: 'Last refresh date' });
};

/**
 * An empty button for the panel.
 * @param id The id of the empty button to avoid duplicate custom id issues.
 * @returns A empty button.
 */
export const emptyButton = (id: string): ButtonBuilder =>
  new ButtonBuilder()
    .setStyle(ButtonStyle['Secondary'])
    .setDisabled(true)
    .setCustomId(`autoDefer_adminPanel_${id}`)
    .setEmoji('▪️');

/**
 * The list of buttons for the panel.
 */
export const panelButtons: ButtonBuilder[] = [
  new ButtonBuilder()
    .setEmoji('<:refresh:1141781454511149196>')
    .setCustomId('adminPanel_refresh')
    .setStyle(ButtonStyle['Primary']),
  new ButtonBuilder()
    .setEmoji('<:ping:1141781630709665962>')
    .setCustomId('adminPanel_ping')
    .setStyle(ButtonStyle['Primary']),
  new ButtonBuilder()
    .setEmoji('<:blacklist:1141782168910180362>')
    .setCustomId('adminPanel_blacklist_create')
    .setStyle(ButtonStyle['Danger']),
  new ButtonBuilder()
    .setEmoji('<:settings:1141782142339260416>')
    .setCustomId('autoDefer_adminPanel_settings')
    .setStyle(ButtonStyle['Danger']),
  new ButtonBuilder()
    .setEmoji('<:flag:1141782136333017129>')
    .setCustomId('autoDefer_adminPanel_status')
    .setStyle(ButtonStyle['Danger']),
  new ButtonBuilder()
    .setEmoji('<:premium:1141782866578116700>')
    .setCustomId('autoDefer_adminPanel_premium')
    .setStyle(ButtonStyle['Success']),
];

/**
 * Generate the rows from the panel buttons list.
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
   * The blacklist panel instance.
   */
  public blacklist: Blacklist;

  /**
   * @param client The client.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Handle the admin panel interactions.
   * @param inter The interaction associated.
   * @returns Nothing.
   */
  public async handle(inter: ButtonInteraction): Promise<void> {
    const id: string = inter.customId as string;
    const task: string = id.replace('autoDefer_', '').split('_').slice(1).join('_');

    if (task.startsWith('blacklist')) {
      this.ctx.btn = inter;
      this.blacklist = new Blacklist(this.client, this.ctx);
      if (task.endsWith('create')) {
        delete this.blacklist.ctx.btn.message;
        await this.blacklist.generate();
      } else {
        await this.blacklist.handle(inter);
      }
    }

    switch (task) {
      case 'refresh':
        await this.refresh(inter);
        break;
      case 'ping':
        await this.ping(inter);
        break;
      default:
        break;
    }
  }

  /**
   * Resend/edit the panel to update information.
   * @returns Nothing.
   */
  public async refreshChannel(): Promise<void | Message> {
    let messages: void | Collection<string, Message> = await this.ctx.channel.messages.fetch().catch(clean);
    if (!messages) return;
    messages = messages.filter((message: Message): boolean => message.author.id === this.client.user.id);

    const payload: BaseMessageOptions = {
      embeds: [await mainEmbed(this.client)],
      components: generatePanelRows(panelButtons),
    };
    if (!messages.first()) await this.ctx.send(payload);
    else await this.ctx.edit(payload, messages.first(), false);
  }

  /**
   * Replies to the refresh button.
   * @param inter The interaction associated.
   * @returns Nothing.
   */
  public async refresh(inter: ButtonInteraction): Promise<void> {
    await this.refreshChannel();
    await inter
      .reply({
        content: `<t:${discordDate()}:T> | <:refreshc:1144631931271659592> | \`Refresh done.\``,
        ephemeral: true,
      })
      .catch(clean);
  }

  /**
   * Replies to the refresh button.
   * @param inter The interaction associated.
   * @returns Nothing.
   */
  public async ping(inter: ButtonInteraction): Promise<void> {
    const latency: number = Math.sqrt((Date.now() - inter.createdTimestamp) ** 2);
    const apiLatency: number = this.client.ws.ping;

    const stylizePing = (ping: number, strToFit: string): string => {
      const languages: { [p: string]: [string, string] } = {
        '300': ['diff', '- '],
        '100': ['fix', ''],
        '0': ['diff', '+ '],
      };
      const language: any =
        languages[
          Object.entries(languages)
            .filter((l: [string, [string, string]]): boolean => Number(l[0]) <= ping)
            .sort((a: [string, [string, string]], b: [string, [string, string]]) => Number(a) - Number(b))
            .at(-1)[0]
        ];
      return `\`\`\`${language[0]}\n${language[1]}${strToFit.replace('{ping}', String(ping))}\`\`\``;
    };

    await inter
      .reply({
        content:
          `<t:${discordDate()}:T> | <:pingc:1144631924598526032> | \`Ping calculated.\`\n` +
          `${stylizePing(latency, 'Latency: {ping} ms')}${stylizePing(apiLatency, 'API Latency: {ping} ms')}`,
        ephemeral: true,
      })
      .catch(clean);
  }
}

/**
 * The channel of the context.
 * @param client The client.
 * @param channel The channel of the context.
 * @param guild The guild of the context.
 * @returns An index instance.
 */
export default async function index(client: Client, channel: Snowflake, guild: Snowflake): Promise<Index> {
  const indexInstance: Index = new Index(client);
  indexInstance.ctx = new Context(await SFToCtxChannel(client, guild, channel), null, null, client.user);
  indexInstance.guild = (await client.guilds.fetch(guild).catch(clean)) || null;

  return indexInstance;
}
