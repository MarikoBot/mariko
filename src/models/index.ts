import { Model, Schema } from 'mongoose';

export * as Core from './Core';
export * as Player from './Player';
export * as Guild from './Guild';
export * as User from './User';
export * as Salesperson from './Salesperson';

export type MongooseCollectionData = {
  Interface: { [p: string]: any };
  schema: Schema;
  model: Model<any>;
  defaultData: MongooseCollectionData['Interface'];
};
