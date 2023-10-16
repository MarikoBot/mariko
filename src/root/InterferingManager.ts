import { ChatInputCommandInteraction, Collection, Snowflake } from 'discord.js';

import SuperClient from './SuperClient';

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
  public readonly client: SuperClient;
  /**
   * The collection of the current cool downs.
   */
  public readonly queue: Collection<Snowflake, InterferingQueueElement[]> = new Collection();

  /**
   * The constructor of the interfering manager.
   *
   * @param client The client instance.
   */
  constructor(client: SuperClient) {
    this.client = client;
  }

  /**
   * Register an interfering command when this command is triggered.
   *
   * @param userId The user id of the command's author.
   * @param commandName The name of the command.
   * @param interaction The interaction id.
   * @returns Nothing.
   */
  public registerInterfering(userId: Snowflake, commandName: string, interaction: ChatInputCommandInteraction): void {
    const currentCoolDowns: InterferingQueueElement[] = this.interfering(userId);

    currentCoolDowns.push([commandName, interaction]);

    this.queue.set(userId, currentCoolDowns);
  }

  /**
   * Returns all the interfering commands for a specified user.
   *
   * @param userId The user id to search for.
   * @param commands The names of the commands to filter by.
   * @returns The full list of the user's cool downs.
   */
  public interfering(userId: Snowflake, ...commands: string[]): InterferingQueueElement[] {
    const currentInterfering: InterferingQueueElement[] | [] = this.queue.get(userId) || [];

    if (commands.length > 0) {
      return currentInterfering.filter((queueElement: InterferingQueueElement): boolean => {
        return commands.some((cmd) => queueElement[0].startsWith(cmd));
      });
    }
    return currentInterfering;
  }

  /**
   * Removes an interfering commands. If a name is passed, remove all the commands with that name.
   * If an id is passed, remove the command with the same interaction id.
   *
   * @param userId The user id to search for.
   * @param key The value to search for; either the name of the command or the interaction id.
   * @returns Nothing.
   */
  public removeInterfering(userId: Snowflake, key: string | Snowflake): void {
    const currentInterfering: InterferingQueueElement[] = this.interfering(userId);

    this.queue.set(
      userId,
      currentInterfering.filter((queueElement: InterferingQueueElement): boolean => {
        return queueElement[1].id !== key;
      }),
    );
  }
}
