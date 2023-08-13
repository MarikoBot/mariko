"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The base server.
 */
class BaseServer {
    /**
     * The client instance.
     */
    client;
    /**
     * The mongoose collection data, model, schema, interface.
     */
    collectionData;
    /**
     * The base server constructor.
     * @param client The client instance.
     * @param data The data for the schema, interface, etc.
     */
    constructor(client, data) {
        this.client = client;
        this.collectionData = data;
    }
    /**
     * Refresh the data in the database if the structure is detected to be different.
     * @param key The key to look apply changes on.
     * @returns Nothing. Only updates.
     */
    async refresh(key) {
        // Code will be added here later.
    }
    /**
     * Get some data from the database.
     * @param key The key to look.
     * @returns The found data.
     */
    async find(key) {
        await this.refresh(key);
        return await this.collectionData.model.findOne(key).exec();
    }
    /**
     * Create a new model instance.
     * @param additionalData The additional data.
     * @returns The created model.
     */
    async create(additionalData) {
        const entry = new this.collectionData.model({
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
    async update(key, data) {
        await this.collectionData.model.updateOne(key, data).exec();
    }
}
exports.default = BaseServer;
