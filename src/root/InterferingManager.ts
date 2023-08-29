import { ChatInputCommandInteraction, Collection, Snowflake } from 'discord.js';

import Client from './Client';

/**
 * Represents an element in the interfering commands queue.
 * Interfering commands are commands that are currently executed.
 */
export type InterferingQueueElement = [
  /**
   * The name of the command.
   */
  string,
  /**
   * The interaction id.
   */
  ChatInputCommandInteraction,
];

/**
 * The main class that manages the active cool downs for commands.
 */
export default class InterferingManager {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The collection of the current cool downs.
   */
  public readonly queue: Collection<Snowflake, InterferingQueueElement[]> = new Collection();

  /**
   * @param client The client instance.
   */
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Register an interfering command when this command is triggered.
   * @param userID The user ID of the command's author.
   * @param commandName The name of the command.
   * @param interaction The interaction id.
   * @returns Void.
   */
  public registerInterfering(userID: Snowflake, commandName: string, interaction: ChatInputCommandInteraction): void {
    const currentCoolDowns: InterferingQueueElement[] = this.interfering(userID);

    currentCoolDowns.push([commandName, interaction]);

    this.queue.set(userID, currentCoolDowns);
  }

  /**
   * Returns all the interfering commands for a specified user.
   * @param userID The user ID to search for.
   * @param commands The names of the commands to filter by.
   * @returns The full list of the user's cool downs.
   */
  public interfering(userID: Snowflake, ...commands: string[]): InterferingQueueElement[] {
    const currentInterfering: InterferingQueueElement[] | [] = this.queue.get(userID) || [];

    if (commands.length > 0) {
      return currentInterfering.filter((queueElement: InterferingQueueElement): boolean => {
        return commands.some((cmd) => queueElement[0].startsWith(cmd));
      });
    }
    return currentInterfering;
  }

  /**
   * Removes an interfering commands. If a name is passed, remove all the commands with that name.
   * If an ID is passed, remove the command with the same interaction ID.
   * @param userID The user ID to search for.
   * @param key The value to search for; either the name of the command or the interaction ID.
   * @returns Void.
   */
  public removeInterfering(userID: Snowflake, key: string | Snowflake): void {
    const currentInterfering: InterferingQueueElement[] = this.interfering(userID);

    this.queue.set(
      userID,
      currentInterfering.filter((queueElement: InterferingQueueElement): boolean => {
        return queueElement[1].id !== key;
      }),
    );
  }
}
