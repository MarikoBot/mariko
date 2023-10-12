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
   * The file for the collection data.
   */
  public readonly collectionData: {
    Model: MongooseCollectionData['Model'];
    schema: MongooseCollectionData['schema'];
    defaultData: MongooseCollectionData['defaultData'];
    PRIMARY_KEY: MongooseCollectionData['PRIMARY_KEY'];
  };
  /**
   * The base server constructor.
   *
   * @param client The client instance.
   * @param fileData The file name for the data.
   */
  constructor(client: Client, fileData: MongooseCollectionData) {
    this.client = client;
    this.collectionData = fileData;
  }

  /**
   * Refresh the data in the database if the structure is detected to be different.
   *
   * @param key The key to look apply changes on.
   * @returns The player data.
   */
  protected async refresh(key: { [p: string]: any }): Promise<{ [p: string]: any }> {
    const data = await this.collectionData.Model.findOne(key).exec();
    if (!data) return data;

    const structure: this['collectionData']['defaultData'] = this.collectionData.defaultData;
    let finalStructure: { [p: string]: any };
    let refreshIsRequired: boolean = false;

    const compareObj = (source: object, target: object, finalObj: object): object => {
      for (const K of Object.keys(source)) {
        if (['commandPrivileges', '__id', 'blacklist'].includes(K)) {
          finalObj[K] = target[K];
          continue;
        }
        if (typeof source[K] !== 'object') {
          finalObj[K] = typeof source[K] !== typeof target[K] ? source[K] : target[K];
        } else {
          if (K in target) finalObj[K] = compareObj(source[K], target[K], {});
          else {
            if (typeof finalObj[K] !== 'object') refreshIsRequired = true;
            finalObj = source[K];
          }
        }
      }
      return finalObj;
    };

    finalStructure = compareObj(structure, data, {});
    if (refreshIsRequired) await this.update(key, finalStructure);
    return finalStructure;
  }

  /**
   * Get some data from the database.
   *
   * @param key The key to look.
   * @returns The found data.
   */
  public async find(key: { [p: string]: any }): Promise<{ [p: string]: any }> {
    return await this.refresh(key);
  }

  /**
   * Create a new model instance.
   *
   * @param additionalData The additional data.
   * @returns Nothing.
   */
  public async create(additionalData: { [p: string]: any }): Promise<void> {
    const doc: { additionalData: { [p: string]: any } } = {
      ...this.collectionData.defaultData,
      additionalData,
    };
    let alreadyExists: boolean = false;

    const primaryKeys: string[] = this.collectionData.PRIMARY_KEY.split('+');
    const primaryValuesEngine: { [p: (typeof primaryKeys)[number]]: any } = {};
    for (const primaryKey of primaryKeys) {
      primaryValuesEngine[primaryKey] = doc[primaryKey];
    }

    if (await this.find(primaryValuesEngine)) alreadyExists = true;
    if (alreadyExists) return;

    const entry: HydratedDocument<models.Core.Interface> = new this.collectionData.Model(doc);
    await entry.save();
  }

  /**
   * Update some data from the database.
   *
   * @param key The key to look.
   * @param data The full data.
   * @returns Nothing.
   */
  public async update(key: { [p: string]: any }, data: object): Promise<void> {
    await this.collectionData.Model.updateOne(key, data).exec();
  }
}
