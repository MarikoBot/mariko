import {
  BaseInteraction,
  InteractionReplyOptions,
  ButtonBuilder,
  InteractionResponse,
  Message,
  EmbedBuilder,
  BaseMessageOptions,
} from 'discord.js';

import { ButtonStyle } from 'discord-api-types/v10';

import Client from '../../../root/Client';
import Context from '../../../root/Context';
import { caught, Colors, discordDate } from '../../../root/Util';
import { generatePanelRows } from '../index';
import { BlacklistData } from '../../../models/Core';

/**
 * The number of elements in the blacklist page.
 */
const eltPerPage: number = 12 as const;

/**
 * The list of buttons for the panel.
 * @param page The page to display.
 * @param elements The number of elements in the blacklist.
 * @returns The list of buttons.
 */
export const panelButtons = (page: number, elements: number): ButtonBuilder[] => [
  new ButtonBuilder()
    .setEmoji('<:previous:1146808689534177413>')
    .setCustomId(`adminpanel_blacklist_pageprevious_${page}`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!page),
  new ButtonBuilder()
    .setEmoji('<:add:1146770731372400690>')
    .setCustomId('adminpanel_blacklist_add')
    .setStyle(ButtonStyle.Success),
  new ButtonBuilder()
    .setEmoji('<:remove:1146770742789287976>')
    .setCustomId('adminpanel_blacklist_remove')
    .setStyle(ButtonStyle.Danger)
    .setDisabled(!elements),
  new ButtonBuilder()
    .setEmoji('<:next:1146808693946581185>')
    .setCustomId(`adminpanel_blacklist_pagenext_${page}`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(elements - page * eltPerPage <= eltPerPage),
];

/**
 * Get the current panel embed with the blacklist.
 * @param client The client.
 * @param color The color name for the embed.
 * @param page The page number.
 * @returns The built embed.
 */
export const mainEmbed = async (
  client: Client,
  color?: keyof typeof Colors,
  page: number = 0,
): Promise<EmbedBuilder> => {
  let colorValue: (typeof Colors)[keyof typeof Colors] = Colors.DARK;
  if (color) colorValue = Colors[color];

  const blacklist: BlacklistData[] = (await client.Server.Core.getBlacklist()) as BlacklistData[];

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(colorValue)
    .setDescription(
      `# <:shieldc:1144631939869982813> Blacklist Panel\n*Use the buttons below to add or remove elements and navigate in the pages.*`,
    )
    .setTimestamp(Date.now())
    .setFooter({ text: 'Last refresh date' });

  if (blacklist.length < eltPerPage * page || blacklist.length === 0) {
    embed.addFields({ name: 'No element to display here.', value: "*It's calm here, and that is nice.*" });
  } else {
    for (let i: number = eltPerPage * page; i < eltPerPage * (page + 1); i++) {
      if (i >= blacklist.length) break;

      const blElement: BlacklistData = blacklist[i];
      embed.addFields({
        name: `**[ID ${i}]** ${blElement.type}: ${blElement.id}`,
        value:
          `\`\`\`diff\n- ${blElement.info}\n\`\`\`` +
          `**- Commands:** ${
            typeof blElement.commands === 'string' ? blElement.commands : blElement.commands.join(', ')
          }\n` +
          `**\\- Date:** <t:${discordDate(blElement.date)}:F>`,
        inline: true,
      });
    }
  }

  return embed;
};

/**
 * The class that includes all the blacklist panel functions.
 */
export default class {
  /**
   * The client instance.
   */
  public client: Client;
  /**
   * The context instance.
   */
  public ctx: Context;

  /**
   * The constructor of the blacklist ephemeral panel.
   * @param client The client instance.
   * @param ctx The context of the panel.
   */
  constructor(client: Client, ctx: Context) {
    this.client = client;
    this.ctx = ctx;
  }

  /**
   * Generate the interaction message options to reply with the given page.
   * @param page The page to set.
   * @returns The interaction reply options.
   */
  public async messageOptions(page: number): Promise<InteractionReplyOptions> {
    return {
      embeds: [await mainEmbed(this.client, 'RED', page)],
      components: generatePanelRows(panelButtons(page, (await this.client.Server.Core.getBlacklist()).length)),
      ephemeral: true,
    };
  }

  /**
   * Generates the blacklist panel.
   * @returns Nothing.
   */
  public async generate(): Promise<any> {
    await this.displayPage(0);
  }

  /**
   * Display another page of the blacklist.
   * @param page The page to display.
   * @returns Nothing.
   */
  public async displayPage(page: number): Promise<any> {
    if (!this.ctx.btn || !this.ctx.btn.message) {
      let generatedMessage: void | InteractionResponse | Message = await this.ctx.btn
        .reply(await this.messageOptions(0))
        .catch(caught);
      if (generatedMessage instanceof InteractionResponse)
        generatedMessage = await generatedMessage.fetch().catch(caught);
      if (!generatedMessage) return;
    } else {
      const generatedOptions: InteractionReplyOptions = await this.messageOptions(page);
      await this.ctx.btn.reply(generatedOptions).catch(caught);
    }
  }

  /**
   * The function that handle the blacklist ephemeral panel.
   */
  public async handle(inter: BaseInteraction): Promise<any> {
    if (inter.isButton()) {
      const action: string = inter.customId.split('_')[2];
      if (action.startsWith('page')) {
        const currentPage: number = Number(this.ctx.btn.message.components[0].components[0].customId.split('_').at(-1));
        await this.displayPage(currentPage + (action.endsWith('previous') ? -1 : 1));
      }
    }
  }
}
