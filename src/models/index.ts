import { Model as ModelClass, Schema } from 'mongoose';

export * as Core from './Core';
export * as Player from './Player';
export * as Guild from './Guild';
export * as User from './User';
export * as Salesperson from './Salesperson';

export type MongooseCollectionData = {
  schema: Schema;
  Model: ModelClass<any>;
  defaultData: { [p: string]: any };
  PRIMARY_KEY: string;
};
