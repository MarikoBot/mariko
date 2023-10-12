"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * The main class that manages the active cool downs for commands.
 */
class CoolDownManager {
    /**
     * The client instance.
     */
    client;
    /**
     * The collection of the current cool downs.
     */
    queue = new discord_js_1.Collection();
    /**
     * The constructor of the cool down manager.
     *
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Register a cool down when a command is triggered.
     *
     * @param userId The user id of the command's author.
     * @param commandName The name of the command.
     * @param coolDown The cool down amount (waiting time before executing it again).
     * @returns Nothing.
     */
    registerCoolDown(userId, commandName, coolDown) {
        const endTime = Date.now() + coolDown * 1000;
        const currentCoolDowns = this.coolDowns(userId);
        currentCoolDowns.push([commandName, endTime, coolDown]);
        this.queue.set(userId, currentCoolDowns);
    }
    /**
     * Returns all the cool downs for a specified user.
     *
     * @param userId The user id to search for.
     * @param commandName The name of the command to filter by.
     * @returns The full list of the user's cool downs.
     */
    coolDowns(userId, commandName) {
        let currentCoolDowns = this.queue.get(userId) || [];
        const currentTime = Date.now();
        currentCoolDowns = currentCoolDowns.filter((queueElement) => {
            return currentTime < queueElement[1];
        });
        this.queue.set(userId, currentCoolDowns);
        if (commandName) {
            return currentCoolDowns.filter((queueElement) => {
                return queueElement[0].startsWith(commandName);
            });
        }
        return currentCoolDowns;
    }
}
exports.default = CoolDownManager;
