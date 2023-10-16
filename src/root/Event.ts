// tslint:disable:no-var-requires
import { Collection } from 'discord.js';

import SuperClient from './SuperClient';
import * as fs from 'fs';

/**
 * The model of a callback function for an event.
 *
 * @param args The command args.
 */
export type EventCallback = (...args: any[]) => void;

/**
 * A default callback function used when nothing is set.
 *
 * @returns Nothing.
 */
export async function callbackDefault(): Promise<void> {
  return void setTimeout(() => null);
}

/**
 * Represents an Event on client service.
 */
export default class Event {
  /**
   * The client instance.
   */
  public readonly client: SuperClient;
  /**
   * The event name.
   */
  public readonly name: string;
  /**
   * The callback function.
   */
  public callback: EventCallback;

  /**
   * The constructor of the event.
   *
   * @param client The client instance.
   * @param name The event name.
   */
  constructor(client: SuperClient, name: string) {
    this.client = client;
    this.name = name;
    this.callback = callbackDefault;
  }
}

/**
 * The collection that includes the default callback functions for basic events.
 */
export const defaultEventsCb: Collection<string, EventCallback> = new Collection();

for (const eventDir of fs.readdirSync('./src/events/')) {
  const eventCallback = require(`../events/${eventDir}/index`);
  defaultEventsCb.set(eventDir, eventCallback.default);
}
