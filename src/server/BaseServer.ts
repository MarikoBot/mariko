import { Model } from 'mongoose';

import Client from '../root/Client';

/**
 * The base server.
 */
export default class BaseServer {
  /**
   * The client instance.
   */
  public readonly client: Client;
  /**
   * The mongoose model.
   */
  public readonly mongooseModel: typeof Model;

  /**
   * The base server constructor.
   * @param client The client instance.
   * @param mongooseModel The mongoose model.
   */
  constructor(client: Client, mongooseModel: typeof Model<any>) {
    this.client = client;
    this.mongooseModel = mongooseModel;
  }
}
