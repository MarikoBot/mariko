import { HydratedDocument } from 'mongoose';

import Client from '../root/Client';
import { MongooseCollectionData } from '../models';
import * as models from '../models';

/**
 * The base server.
 */
export default class BaseServer {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The mongoose collection data, model, schema, interface.
   */
  public readonly collectionData: MongooseCollectionData;

  /**
   * The base server constructor.
   * @param client The client instance.
   * @param data The data for the schema, interface, etc.
   */
  constructor(client: Client, data: any) {
    this.client = client;
    this.collectionData = data as MongooseCollectionData;
  }

  /**
   * Refresh the data in the database if the structure is detected to be different.
   * @param key The key to look apply changes on.
   * @returns Nothing. Only updates.
   */
  protected async refresh(key: { [p: string]: any }): Promise<void> {
    // Code will be added here later.
  }

  /**
   * Get some data from the database.
   * @param key The key to look.
   * @returns The found data.
   */
  public async find(key: { [p: string]: any }): Promise<{}> {
    await this.refresh(key);
    return await this.collectionData.model.findOne(key).exec();
  }

  /**
   * Create a new model instance.
   * @param additionalData The additional data.
   * @returns The created model.
   */
  public async create(additionalData: { [p: string]: any }): Promise<void> {
    const entry: HydratedDocument<models.Core.Interface> = new this.collectionData.model({
      ...this.collectionData.defaultData,
      additionalData,
    });
    await entry.save();
  }

  /**
   * Update some data from the database.
   * @param key The key to look.
   * @param data The full data.
   * @returns Nothing.
   */
  public async update(key: { [p: string]: any }, data: MongooseCollectionData['Interface']): Promise<void> {
    await this.collectionData.model.updateOne(key, data).exec();
  }
}
