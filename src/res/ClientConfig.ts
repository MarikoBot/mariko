import { ActivityType, PresenceData } from 'discord.js';

/*
  The default data for the client.
 */
namespace ClientConfig {
  /**
   * The opening brackets for variables in strings.
   */
  export const varBracketsOpen: string = '[[';

  /**
   * The closing brackets for variables in strings.
   */
  export const varBracketsClose: string = ']]';

  /**
   * The brackets for variables in strings.
   */
  export const varBrackets: string = varBracketsOpen + varBracketsClose;

  /**
   * The opening brackets for extracted data.
   */
  export const extBracketsOpen: string = '{{';

  /**
   * The closing brackets for extracted data.
   */
  export const extBracketsClose: string = '}}';

  /**
   * The brackets for extracted data.
   */
  export const extBrackets: string = extBracketsOpen + extBracketsClose;

  /**
   * The splitter for extracted data.
   */
  export const extSplitter: string = '::';

  /**
   * The default client id.
   */
  export const defaultClientId: string = '1146155436496670820';

  /**
   * Intents to enable for this connection.
   */
  export const intents: number = 3276799;

  /**
   * The default value for MessageReplyOptions#failIfNotExists.
   */
  export const failIfNotExists: boolean = false;

  /**
   * Presence data to use upon login.
   */
  export const presence: PresenceData = {
    status: 'online',
    activities: [
      {
        name: `with version ${require('../../package.json').version}`,
        type: ActivityType['Playing'],
      },
    ],
  } as PresenceData;

  /**
   * The directory to load the commands from.
   */
  export const commandsDir: string = 'Res/Commands';

  /**
   * Whether the client should load commands or not. Load commands means sending commands to the API.
   * Don't activate this permanently, it's only on change.
   */
  export const loadCommands: boolean = true;

  /**
   * Represents the default timeout for any message component interaction.
   */
  export const defaultComponentTimeout: number = 120000;

  /**
   * Represents the default timeout for modal component interaction.
   */
  export const defaultModalTimeout: number = 300000;

  /**
   * The regular expression for username input.
   */
  export const usernameRegexp: RegExp = /^[a-zA-Z0-9éèàçùòñõâêîôû'."]+(?:\s[a-zA-Z0-9]+)*$/gs;

  /**
   * Commands list regular expression.
   */
  export const commandsListRegexp: RegExp = /^[a-z]+(?: [a-z]+)*(?:, [a-z]+(?: [a-z]+)*)*$/gm;

  /**
   * Numbers regular expression.
   */
  export const numbersRegexp: RegExp = /[0-9]+/gm;

  /**
   * The list of Ids regular expression.
   */
  export const idsListRegexp: RegExp = /^[0-9]{18,21}(?: [0-9]{18,21})*(?:, [0-9]{18,21}(?: [0-9]{18,21})*)*$/gm;

  /**
   * The list of the owners of the bot.
   */
  export const owners: string[] = ['539842701592494111', '1146145475683164273'];

  /**
   * The support guild id.
   */
  export const supportGuildId: string = '1113177643710423060';

  /**
   * The roles for the support.
   */
  export const supportRoles: { [p: string]: string } = {
    /**
     * The manager one.
     */
    manager: '1141396826084356096',
    /**
     * The moderator one.
     */
    mod: '1138785200541806592',
    /**
     * The helper one.
     */
    helper: '1138785004852367402',
  };
}

export default ClientConfig;
