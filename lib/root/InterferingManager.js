"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * The main class that manages the active cool downs for commands.
 */
class InterferingManager {
    /**
     * The client instance.
     */
    client;
    /**
     * The collection of the current cool downs.
     */
    queue = new discord_js_1.Collection();
    /**
     * @param client The client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Register an interfering command when this command is triggered.
     * @param userID The user ID of the command's author.
     * @param commandName The name of the command.
     * @param interaction The interaction id.
     * @returns Void.
     */
    registerInterfering(userID, commandName, interaction) {
        const currentCoolDowns = this.interfering(userID);
        currentCoolDowns.push([commandName, interaction]);
        this.queue.set(userID, currentCoolDowns);
    }
    /**
     * Returns all the interfering commands for a specified user.
     * @param userID The user ID to search for.
     * @param commands The names of the commands to filter by.
     * @returns The full list of the user's cool downs.
     */
    interfering(userID, ...commands) {
        const currentInterfering = this.queue.get(userID) || [];
        if (commands.length > 0) {
            return currentInterfering.filter((queueElement) => {
                return commands.includes(queueElement[0]);
            });
        }
        return currentInterfering;
    }
    /**
     * Removes an interfering commands. If a name is passed, remove all the commands with that name.
     * If an ID is passed, remove the command with the same interaction ID.
     * @param userID The user ID to search for.
     * @param key The value to search for; either the name of the command or the interaction ID.
     * @returns Void.
     */
    removeInterfering(userID, key) {
        const currentInterfering = this.interfering(userID);
        const interferingNames = currentInterfering.map((queueElement) => queueElement[0]);
        this.queue.set(userID, currentInterfering.filter((queueElement) => {
            return queueElement[1].id !== key;
        }));
    }
}
exports.default = InterferingManager;
