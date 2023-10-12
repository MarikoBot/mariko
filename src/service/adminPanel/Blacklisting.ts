import {
  BaseInteraction,
  InteractionReplyOptions,
  ButtonBuilder,
  InteractionResponse,
  Message,
  EmbedBuilder,
  BaseMessageOptions,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitFields,
  Guild,
  User,
  Snowflake,
  ChatInputCommandInteraction,
} from 'discord.js';

import { ButtonStyle, TextInputStyle } from 'discord-api-types/v10';

import Client from '../../root/Client';
import Context from '../../root/Context';
import { clean, Colors, discordDate, IdToGuild, IdToUser } from '../../root/Util';
import { generatePanelRows, TestedModalSubitFields } from './Monitoring';
import { BlacklistData } from '../../models/Core';
import ClientConfig from '../../res/ClientConfig';
import Emojis from '../../res/Emojis';

/**
 * The number of elements in the blacklist page.
 */
const eltPerPage: number = 12 as const;

/**
 * The list of buttons for the panel.
 *
 * @param elements The number of elements in the blacklist.
 * @returns The list of buttons.
 */
export const panelButtons = (elements: number): ButtonBuilder[] => {
  const buttonsDisabled: boolean = elements <= eltPerPage;
  return [
    new ButtonBuilder()
      .setEmoji(Emojis.lightBack)
      .setCustomId(`blacklistPanel_previousPage`)
      .setStyle(ButtonStyle['Primary'])
      .setDisabled(buttonsDisabled),
    new ButtonBuilder()
      .setEmoji(Emojis.lightNext)
      .setCustomId(`blacklistPanel_nextPage`)
      .setStyle(ButtonStyle['Primary'])
      .setDisabled(buttonsDisabled),
  ];
};

/**
 * Get the current panel embed with the blacklist.
 *
 * @param blacklist The blacklist.
 * @param color The color name for the embed.
 * @param page The page number.
 * @returns The built embed.
 */
export const mainEmbed = async (
  blacklist: BlacklistData[],
  color?: keyof typeof Colors,
  page: number = 0,
): Promise<EmbedBuilder> => {
  let colorValue: (typeof Colors)[keyof typeof Colors] = Colors.DARK;
  if (color) colorValue = Colors[color];

  const embed: EmbedBuilder = new EmbedBuilder()
    .setColor(colorValue)
    .setDescription(`# Blacklist Panel\n*Use the buttons below to add or remove elements and navigate in the pages.*`)
    .setTimestamp(Date.now())
    .setFooter({ text: 'Last refresh date' });

  if (blacklist.length < eltPerPage * page || blacklist.length === 0) {
    embed.addFields({ name: 'No element to display here.', value: "*It's calm here, and that is nice.*" });
  } else {
    for (let i: number = eltPerPage * page; i < eltPerPage * (page + 1); i++) {
      if (i >= blacklist.length) break;

      const blElement: BlacklistData = blacklist[i];
      embed.addFields({
        name: Emojis.invisibleSquare,
        value:
          `\`\`\`diff\n- ${blElement.type}: ${blElement.id}\n\`\`\`` +
          `**・Infos:** ${blElement.info}\n` +
          `**・Commands:** ${
            typeof blElement.commands === 'string' ? blElement.commands : blElement.commands.join(', ')
          }\n` +
          `**・Date:** <t:${discordDate(blElement.date)}:F>`,
        inline: true,
      });
    }
  }

  return embed;
};

/**
 * The class that includes all the blacklist panel functions.
 */
export default class Blacklisting {
  /**
   * The client instance.
   */
  public client: Client;
  /**
   * The context instance.
   */
  public ctx: Context;

  /**
   * The constructor of the blacklist panel.
   *
   * @param client The client instance.
   * @param ctx The context of the panel.
   */
  constructor(client: Client, ctx: Context) {
    this.client = client;
    this.ctx = ctx;
  }

  /**
   * Get the current blacklist.
   */
  get blacklist() {
    return this.client.Servers.Core.getBlacklist() as Promise<BlacklistData[]>;
  }

  /**
   * Generate the interaction message options to reply with the given page.
   *
   * @param page The page to set.
   * @returns The interaction reply options.
   */
  public async messageOptions(page: number): Promise<InteractionReplyOptions> {
    return {
      embeds: [await mainEmbed(await this.blacklist, 'RED', page)],
      components: generatePanelRows(panelButtons((await this.client.Servers.Core.getBlacklist()).length)),
      ephemeral: true,
    };
  }

  /**
   * Handle the pagination menu to display blacklisted users.
   *
   * @param inter The interaction associated.
   * @returns Nothing.
   */
  public async handlePagination(inter: ChatInputCommandInteraction): Promise<void> {
    let pageOptions: BaseMessageOptions = (await this.messageOptions(0)) as BaseMessageOptions;
    let panel: void | InteractionResponse | Message = await inter.reply(pageOptions);
    if (!panel) return;
    panel = (await panel.fetch().catch(clean)) as Message;
    if (!panel) return;

    const collectorOptions: object = {
      filter: (buttonInteraction: ButtonInteraction) => buttonInteraction.customId.endsWith('Page'),
      time: 30000,
    };

    let i: number = 0;
    let loop: boolean = true;

    while (loop) {
      const collector = await panel.awaitMessageComponent(collectorOptions).catch(clean);
      if (!collector) {
        loop = false;
        break;
      }

      i += { previousPage: -1, nextPage: 1 }[collector.customId.split('_')[1]];
      const maxPageIndex: number = Math.floor((await this.blacklist).length / eltPerPage);
      if (i < 0) i = maxPageIndex;
      if (i > maxPageIndex) i = 0;

      pageOptions = (await this.messageOptions(i)) as BaseMessageOptions;
      delete pageOptions['ephemeral'];
      await panel.edit(pageOptions).catch(clean);
      await collector.deferUpdate().catch(clean);
    }
  }

  /**
   * Show the modal to add an element.
   *
   * @param inter The associated interaction.
   * @returns Nothing.
   */
  public async displayAddModal(inter: ChatInputCommandInteraction): Promise<void> {
    const modal: ModalBuilder = this.ctx.transformModalData({
      customId: 'blacklist_add',
      title: '➕ Add an element to the blacklist',
      fields: [
        {
          label: 'The id of the guild/server',
          minLength: 18,
          maxLength: 20,
          placeholder: 'Right click the element to copy theid.',
          style: TextInputStyle['Short'],
          id: 'id',
          required: true,
        },
        {
          label: "If it's a guild or a user",
          minLength: 4,
          maxLength: 5,
          placeholder: 'user/guild',
          style: TextInputStyle['Short'],
          id: 'type',
          required: true,
          value: 'user',
        },
        {
          label: 'The reason/additional info',
          minLength: 10,
          placeholder: '"This user is a threat."/"This guild is not good."',
          style: TextInputStyle['Paragraph'],
          id: 'info',
          required: true,
        },
        {
          label: 'The commands to blacklist',
          minLength: 3,
          placeholder: '"all"/"command1, command2"',
          style: TextInputStyle['Paragraph'],
          id: 'commands',
          required: true,
          value: 'all',
        },
      ],
    });
    await inter.showModal(modal).catch(clean);
  }

  /**
   * Show the modal to remove an element.
   *
   * @param inter The associated interaction.
   * @returns Nothing.
   */
  public async displayRemoveModal(inter: ButtonInteraction): Promise<void> {
    const modal: ModalBuilder = this.ctx.transformModalData({
      customId: 'blacklist_remove',
      title: '➖ Remove an element from the blacklist',
      fields: [
        {
          label: 'The index of the element to remove.',
          minLength: 1,
          placeholder: 'This index is found on the panel, in the [].',
          style: TextInputStyle['Short'],
          id: 'index',
          required: true,
        },
        {
          label: 'The reason/additional info',
          minLength: 10,
          placeholder: 'Why this user/guild should be un-blacklisted.',
          style: TextInputStyle['Paragraph'],
          id: 'info',
          required: true,
        },
      ],
    });
    await inter.showModal(modal).catch(clean);
  }

  /**
   * Validate if the modal values are ready to be set in the database.
   * This function is for adding something to the blacklist.
   *
   * @param fields The submitted fields.
   * @param authorId The author id of the modal.
   * @returns The formatted response for this function. If it's valid or not.
   */
  public async validAddModal(fields: ModalSubmitFields, authorId: Snowflake): Promise<TestedModalSubitFields> {
    const tested: TestedModalSubitFields = {
      valid: true,
      errors: [],
      data: fields.fields,
      name: 'missing',
    };

    const idValue: string = fields.fields.get('id').value;
    const typeValue: string = fields.fields.get('type').value;
    const commandsValue: string = fields.fields.get('commands').value;

    const fetchedThing: User | Guild | false =
      (await IdToGuild(this.client, idValue)) || (await IdToUser(this.client, idValue)) || false;

    const fetchedType: string = fetchedThing ? fetchedThing.constructor.name.toLowerCase() : null;

    if (fetchedThing) tested.name = fetchedThing instanceof User ? fetchedThing.username : fetchedThing.name || idValue;
    else tested.name = idValue;

    if (fetchedType) {
      if (fetchedType !== typeValue) {
        tested.valid = false;
        tested.errors.push(
          `${Emojis.coloredForbidden} Type **${typeValue}** cannot be associated with **${fetchedType}** object for \`${idValue}\`.`,
        );
      }
    } else
      tested.errors.push(
        `${Emojis.coloredWarning} No **${typeValue}** was found for \`${idValue}\`. This warning can occur when the ${typeValue} is not available by the bot.`,
      );

    if (!ClientConfig.commandsListRegexp.test(commandsValue)) {
      tested.valid = false;
      tested.errors.push(
        `${Emojis.coloredForbidden} \`${commandsValue}\` string must follow the below rule:\`\`\`fix\n${ClientConfig.commandsListRegexp}\`\`\`` +
          `Example:\`\`\`fix\ninfo, help, test fruits\`\`\`*(You can specify longer names to exclude only subcommands from the blacklisted entry.)*`,
      );
    }

    if (!(await this.client.supportGuild.takesPriority(authorId, idValue))) {
      tested.valid = false;
      tested.errors.push(
        `${Emojis.coloredForbidden} You can't blacklist **${tested.name}** because they are equal or higher than you.`,
      );
    }

    const blacklist: BlacklistData[] = await this.client.Servers.Core.getBlacklist();

    if (blacklist.map((e: BlacklistData) => e.id).includes(idValue)) {
      tested.valid = false;
      tested.errors.push(
        `${Emojis.coloredForbidden} Object \`${tested.name}\` is already blacklisted. If you want to change informations, remove it before.`,
      );
    }

    if (!['user', 'guild'].includes(typeValue)) {
      tested.valid = false;
      tested.errors.push(`${Emojis.coloredForbidden} Type **${typeValue}** must be type user or guild.`);
    }

    return tested;
  }

  /**
   * Validate if the modal values are able to remove something in the database.
   * This function is for adding something to the blacklist.
   *
   * @param fields The submitted fields.
   * @returns The formatted response for this function. If it's valid or not.
   */
  public async validRemoveModal(fields: ModalSubmitFields): Promise<TestedModalSubitFields> {
    const tested: TestedModalSubitFields = {
      valid: true,
      errors: [],
      data: fields.fields,
      name: 'missing',
    };

    const indexValue: string = fields.fields.get('index').value;
    tested.name = indexValue;

    if (!ClientConfig.numbersRegexp.test(indexValue)) {
      tested.valid = false;
      tested.errors.push(`${Emojis.coloredForbidden} \`${indexValue}\` value must be a number.`);
    }

    const blacklist: BlacklistData[] = await this.client.Servers.Core.getBlacklist();
    const blacklistLength: number = blacklist.length;

    if (Number(indexValue) > blacklistLength) {
      tested.valid = false;
      tested.errors.push(
        `${Emojis.coloredForbidden} There aren't as many elements in the blacklist. ` +
          `\`${indexValue}\` is out of range \`${0}-${blacklistLength - 1}\`.`,
      );
    }

    tested.name = blacklist[Number(indexValue)].id;

    return tested;
  }
}
