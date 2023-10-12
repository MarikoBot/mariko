import {
  BaseInteraction,
  ButtonBuilder,
  ButtonInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  ModalBuilder,
  ModalSubmitFields,
  ModalSubmitInteraction,
} from 'discord.js';

import { ButtonStyle, TextInputStyle } from 'discord-api-types/v10';

import Client from '../../root/Client';
import Context from '../../root/Context';
import { clean, Colors } from '../../root/Util';
import { generatePanelRows, TestedModalSubitFields } from './Monitoring';
import Emojis from '../../res/Emojis';
import { CommandPrivileges, commandPrivilegesKeys } from '../../models/Core';
import ClientConfig from '../../res/ClientConfig';
import Command from '../../root/Command';

/**
 * The list of buttons for the panel.
 *
 * @param commandName The command name.
 * @returns The list of buttons.
 */
export const panelButtons = (commandName: string): ButtonBuilder[] => {
  return [
    new ButtonBuilder()
      .setEmoji(Emojis.lightPencil)
      .setCustomId(`commandsPrivileges_unique_${commandName.replace('_', '::')}`)
      .setStyle(ButtonStyle['Success']),
    new ButtonBuilder()
      .setEmoji(Emojis.lightPencil)
      .setCustomId(`commandsPrivileges_forbidden_${commandName.replace('_', '::')}`)
      .setStyle(ButtonStyle['Danger']),
  ];
};

/**
 * Get the current panel embed with the command information displayed.
 *
 * @param commandPrivileges The command privileges.
 * @param fullName The command full name.
 * @param color The color name for the embed.
 * @returns The built embed.
 */
export const mainEmbed = async (
  commandPrivileges: CommandPrivileges,
  fullName: string,
  color?: keyof typeof Colors,
): Promise<EmbedBuilder> => {
  let colorValue: (typeof Colors)[keyof typeof Colors] = Colors.DARK;
  if (color) colorValue = Colors[color];

  return new EmbedBuilder()
    .setColor(colorValue)
    .setFields(
      ...Object.entries(commandPrivileges).map((privileges: [string, string[]]) => ({
        name: privileges[0],
        value: privileges[1].length
          ? privileges[1].map((value: string): string => `\`${value}\``).join(' :: ')
          : 'No value',
        inline: false,
      })),
    )
    .setTimestamp(Date.now())
    .setFooter({ text: 'Last refresh date' });
};

/**
 * The class that includes all the commands privileges functions.
 */
export default class CommandsPrivilegesSetting {
  /**
   * The client instance.
   */
  public client: Client;
  /**
   * The context instance.
   */
  public ctx: Context;

  /**
   * The constructor of the commands privileges panel.
   *
   * @param client The client instance.
   * @param ctx The context of the panel.
   */
  constructor(client: Client, ctx: Context) {
    this.client = client;
    this.ctx = ctx;
  }

  /**
   * The function that handle the commands privileges ephemeral panel.
   *
   * @param inter The associated interaction.
   * @returns Nothing.
   */
  public async handle(inter: BaseInteraction): Promise<any> {
    const privileges: Record<string, CommandPrivileges> = await this.client.Servers.Core.getCommandsPrivilegesList();

    if (inter.isButton()) {
      const action: string = inter.customId.split('_')[2];
      if (action === 'unique' || action === 'forbidden') {
        const commandName: string = inter.customId.split('_')[3].replace('::', '');
        await this.displayCommandEditModal(inter, privileges[commandName], action);
      }
    }
  }

  /**
   * Generate the interaction message options to reply with the given page.
   *
   * @param commandPrivileges The command privileges.
   * @param fullName The command full name.
   * @returns The interaction reply options.
   */
  public async messageOptions(
    commandPrivileges: CommandPrivileges,
    fullName: string,
  ): Promise<InteractionReplyOptions> {
    return {
      embeds: [await mainEmbed(commandPrivileges, fullName, 'YELLOW')],
      components: generatePanelRows(panelButtons(fullName)),
      ephemeral: true,
    };
  }

  /**
   * Send an embed with the command information on it.
   *
   * @param inter ModalSubmitInteraction
   * @param fullName The command full name.
   */
  public async displayCommandEmbed(inter: ModalSubmitInteraction, fullName: string) {
    const privileges: Record<string, CommandPrivileges> = await this.client.Servers.Core.getCommandsPrivilegesList();

    await inter.reply(await this.messageOptions(privileges[fullName], fullName)).catch(clean);
  }

  /**
   * Display the modal to edit the command privileges (unique main).
   *
   * @param inter The associated interaction.
   * @param privileges The privileges for the command.
   * @param main The part of privileges to edit: forbidden privileges or unique privileges.
   * @returns Nothing.
   */
  public async displayCommandEditModal(
    inter: ButtonInteraction,
    privileges: CommandPrivileges,
    main: 'forbidden' | 'unique' = 'unique',
  ): Promise<void> {
    const modal: ModalBuilder = this.ctx.transformModalData({
      customId: 'commandsPrivileges_edit',
      title: "🔎 Edit command - command's data",
      fields: [
        ...commandPrivilegesKeys
          .filter((privilege: string): boolean => privilege.startsWith(main))
          .map((privilege: string) => {
            return {
              label: privilege,
              value:
                privilege in privileges ? (privileges[privilege].length ? privileges[privilege].join(', ') : '') : '',
              style: TextInputStyle['Paragraph'],
              id: privilege,
              required: false,
            };
          }),
      ],
    });
    await inter.showModal(modal).catch(clean);
  }

  /**
   * Validate if the modal values are able to get in the privileges.
   *
   * @param fields The submitted fields.
   * @returns The formatted response for this function. If it's valid or not.
   */
  public async validCommandEditForbiddenModal(fields: ModalSubmitFields): Promise<TestedModalSubitFields> {
    const tested: TestedModalSubitFields = {
      valid: true,
      errors: [],
      data: fields.fields,
      name: 'forbidden',
    };

    const channelsValue: string = fields.fields.get(`forbiddenChannels`).value;
    const guildsValue: string = fields.fields.get(`forbiddenGuilds`).value;
    const rolesValue: string = fields.fields.get(`forbiddenRoles`).value;
    const usersValue: string = fields.fields.get(`forbiddenUsers`).value;

    const currentPrivileges: CommandPrivileges = await this.client.Servers.Core.getExternalPrivileges(
      'test fruit banana',
    );
    const channelsOpposite: string[] = currentPrivileges.uniqueChannels;
    const guildsOpposite: string[] = currentPrivileges.uniqueGuilds;
    const rolesOpposite: string[] = currentPrivileges.uniqueRoles;
    const usersOpposite: string[] = currentPrivileges.uniqueUsers;

    for (const concept of ['channels', 'guilds', 'roles', 'users']) {
      let conceptValue: string | string[] = eval(`${concept}Value`) as string;
      const conceptOpposite: string | string[] = eval(`${concept}Opposite`) as string;

      if (!ClientConfig.idsListRegexp.test(conceptValue) || !ClientConfig.idsListRegexp.test(conceptOpposite)) {
        tested.valid = false;
        tested.errors.push(
          `${Emojis.coloredForbidden} \`${
            ClientConfig.idsListRegexp.test(conceptValue) ? conceptOpposite : conceptValue
          }\` string must follow the below rule:\`\`\`fix\n${ClientConfig.idsListRegexp}\`\`\`` +
            `Example:\`\`\`fix\ninfo, help, test fruits\`\`\`*(You can specify longer names to exclude only subcommands from the blacklisted entry.)*`,
        );
      }

      conceptValue = conceptValue.split(', ');

      for (const value of conceptValue) {
        if (conceptOpposite.includes(value)) {
          tested.valid = false;
          tested.errors.push(
            `${Emojis.coloredForbidden} The value \`${value}\` is present on both side of \`${concept}\` (forbidden + unique).`,
          );
        }
      }
    }

    return tested;
  }
}
