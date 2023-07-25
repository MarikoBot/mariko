import { Schema, model, Types } from 'mongoose';
import { Snowflake } from 'discord.js';

/**
 * The interface of a document.
 */
export interface Interface {}

/**
 * The mongo schema for the interface.
 */
const schema = new Schema<Interface>({});

/**
 * The generated model for the schema.
 */
export const Model = model<Interface>('User', schema);
