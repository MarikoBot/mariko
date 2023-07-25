"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs = require("fs");
const ClientConfig_1 = require("../res/ClientConfig");
const CommandManager_1 = require("./CommandManager");
const EventManager_1 = require("./EventManager");
const PlayerServer_1 = require("../server/PlayerServer");
const UserServer_1 = require("../server/UserServer");
const GuildServer_1 = require("../server/GuildServer");
const CoreServer_1 = require("../server/CoreServer");
const LanguageManager_1 = require("./LanguageManager");
const game_1 = require("../service/game/");
/**
 * The pre-configured client class for the bot.
 */
class default_1 extends discord_js_1.Client {
    /**
     * The directory to load the commands from.
     */
    commandsDir = ClientConfig_1.default.commandsDir;
    /**
     * The command manager instance.
     */
    Commands = new CommandManager_1.default(this);
    /**
     * The event manager instance.
     */
    Events = new EventManager_1.default(this);
    /**
     * The database collections interface.
     */
    Server = {
        Player: new PlayerServer_1.default(this),
        Guild: new GuildServer_1.default(this),
        User: new UserServer_1.default(this),
        Core: new CoreServer_1.default(this),
    };
    /**
     * The service handler interface.
     */
    Service = {
        Game: game_1.default,
    };
    /**
     * The language manager for accessing strings.
     */
    Languages = new LanguageManager_1.default(this);
    /**
     * The constructor of the client.
     */
    constructor() {
        super({
            intents: ClientConfig_1.default.intents,
            failIfNotExists: ClientConfig_1.default.failIfNotExists,
            presence: ClientConfig_1.default.presence,
        });
    }
    /**
     * The function to load the commands.
     * @returns {Promise<void>}
     */
    async loadCommands() {
        const dir = fs.readdirSync(`./lib/${this.commandsDir}`);
        const commandsList = [];
        for (const file of dir) {
            const command = require(`../${this.commandsDir}/${file}`).default;
            commandsList.push(command);
            this.Commands.add(command);
        }
        if (ClientConfig_1.default.loadCommands)
            await this.application.commands.set(commandsList);
    }
    /**
     * Launch the client after bounding events and sending commands to the API, if necessary.
     * Returns a simple string.
     * @param token The client token, if not specified before.
     * @returns A string constant "Logged in."
     */
    async login(token) {
        this.Events.events.each((event) => {
            if (event.name !== 'voiceStateUpdate') {
                const method = event.name === 'ready' ? 'once' : 'on';
                this[method](event.name, (...args) => {
                    event.callback(this, ...args);
                });
            }
        });
        const logged = await super.login(token || this.token);
        await this.loadCommands();
        return logged;
    }
}
exports.default = default_1;
