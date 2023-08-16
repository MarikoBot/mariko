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
     * The file for the collection data.
     */
    collectionData;
    /**
     * The base server constructor.
     * @param client The client instance.
     * @param file The file name for the data.
     */
    constructor(client, fileData) {
        this.client = client;
        this.collectionData = fileData;
    }
    /**
     * Refresh the data in the database if the structure is detected to be different.
     * @param key The key to look apply changes on.
     * @returns The player data.
     */
    async refresh(key) {
        const data = await this.collectionData.Model.findOne(key).exec();
        if (!data)
            return data;
        const structure = this.collectionData.defaultData;
        let finalStructure = {};
        const compareObj = (source, target, finalObj) => {
            for (const K of Object.keys(source)) {
                if (['commandPrivileges', '__id'].includes(K)) {
                    finalObj[K] = target[K];
                    continue;
                }
                if (typeof source[K] !== 'object') {
                    finalObj[K] = typeof source[K] !== typeof target[K] ? source[K] : target[K];
                }
                else {
                    if (K in target)
                        finalObj[K] = compareObj(source[K], target[K], {});
                    else
                        finalObj = source[K];
                }
            }
            return finalObj;
        };
        finalStructure = compareObj(structure, data, {});
        return finalStructure;
    }
    /**
     * Get some data from the database.
     * @param key The key to look.
     * @returns The found data.
     */
    async find(key) {
        return await this.refresh(key);
    }
    /**
     * Create a new model instance.
     * @param additionalData The additional data.
     * @returns The created model.
     */
    async create(additionalData) {
        const entry = new this.collectionData.Model({
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
        await this.collectionData.Model.updateOne(key, data).exec();
    }
}
exports.default = BaseServer;
