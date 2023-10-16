"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEventsCb = exports.callbackDefault = void 0;
// tslint:disable:no-var-requires
const discord_js_1 = require("discord.js");
const fs = require("fs");
/**
 * A default callback function used when nothing is set.
 *
 * @returns Nothing.
 */
async function callbackDefault() {
    return void setTimeout(() => null);
}
exports.callbackDefault = callbackDefault;
/**
 * Represents an Event on client service.
 */
class Event {
    /**
     * The client instance.
     */
    client;
    /**
     * The event name.
     */
    name;
    /**
     * The callback function.
     */
    callback;
    /**
     * The constructor of the event.
     *
     * @param client The client instance.
     * @param name The event name.
     */
    constructor(client, name) {
        this.client = client;
        this.name = name;
        this.callback = callbackDefault;
    }
}
exports.default = Event;
/**
 * The collection that includes the default callback functions for basic events.
 */
exports.defaultEventsCb = new discord_js_1.Collection();
for (const eventDir of fs.readdirSync('./src/events/')) {
    const eventCallback = require(`../events/${eventDir}/index`);
    exports.defaultEventsCb.set(eventDir, eventCallback.default);
}
