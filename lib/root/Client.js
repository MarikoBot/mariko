"use strict";
// noinspection JSUnresolvedReference,JSUnusedGlobalSymbols
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
class SuperClient extends discord_js_1.Client {
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
     * Generates a slash command builder instance from a CommandType typed object.
     * @param commandData The command data.
     * @param builderType Specify if the builder to return concerns a command, sub command or sub command group.
     * @returns The builder instance.
     */
    static materializeBuilder(commandData, builderType) {
        let builder = {
            slash: new discord_js_1.SlashCommandBuilder(),
            sub: new discord_js_1.SlashCommandSubcommandBuilder(),
            group: new discord_js_1.SlashCommandSubcommandGroupBuilder(),
        }[builderType];
        builder
            .setName(commandData.name)
            .setNameLocalization('en-US', commandData.name)
            .setNameLocalizations(Object.assign({ 'en-US': commandData.name }, commandData.nameLocalizations || {}))
            .setDescription(commandData.description || 'No description yet.')
            .setDescriptionLocalization('en-US', commandData.description || 'No description yet.')
            .setDescriptionLocalizations(Object.assign({ 'en-US': commandData.description }, commandData.descriptionLocalizations || {}));
        if (builderType === 'slash') {
            commandData = commandData;
            builder = builder;
            builder
                .setNSFW(commandData.nsfw || false)
                .setDMPermission(commandData.dmPermission || false)
                .setDefaultMemberPermissions(commandData.defaultMemberPermissions?.toString() || discord_js_1.PermissionFlagsBits.ViewChannel);
        }
        return builder;
    }
    /**
     * The function to load the commands.
     * @returns Nothing.
     */
    async loadCommands() {
        const dir = fs.readdirSync(`./lib/${this.commandsDir}`);
        const commandsList = [];
        for (const rootCommandsDir of dir) {
            const commandDirElements = fs.readdirSync(`./lib/${this.commandsDir}/${rootCommandsDir}`);
            if (commandDirElements.length === 1 && commandDirElements[0] === 'index.js') {
                const commandType = require(`../${this.commandsDir}/${rootCommandsDir}/index`)
                    .default;
                const materialized = SuperClient.materializeBuilder(commandType, 'slash');
                commandsList.push(Object.assign(materialized, commandType));
                continue;
            }
            const rootPath = `${this.commandsDir}/${rootCommandsDir}`;
            const commandBaseData = require(`../${this.commandsDir}/${rootCommandsDir}/index`).default;
            const command = Object.assign(SuperClient.materializeBuilder(commandBaseData, 'slash'), commandBaseData);
            const includesFolder = commandDirElements.some((element) => {
                return fs.statSync(`./lib/${rootPath}/${element}`).isDirectory();
            });
            for (const commandDirElement of commandDirElements) {
                let cmdOrGroup = new discord_js_1.SlashCommandBuilder();
                const elementFileOrFolder = fs.statSync(`./lib/${rootPath}/${commandDirElement}`);
                if (elementFileOrFolder.isFile()) {
                    const commandDataType = require(`../${rootPath}/${commandDirElement}`).default;
                    if (commandDirElement === 'index.js') {
                        const materializedOrgan = SuperClient.materializeBuilder(commandDataType, 'slash');
                        cmdOrGroup = includesFolder
                            ? materializedOrgan
                            : materializedOrgan;
                        continue;
                    }
                    const materialized = SuperClient.materializeBuilder(commandDataType, 'sub');
                    const assigned = Object.assign(materialized, commandDataType);
                    cmdOrGroup.addSubcommand(assigned);
                }
                if (!elementFileOrFolder.isDirectory())
                    continue;
                const subcommandGroupsList = fs.readdirSync(`./lib/${rootPath}/${commandDirElement}/`);
                let commandData = require(`../${rootPath}/${commandDirElement}/index.js`).default;
                cmdOrGroup = Object.assign(SuperClient.materializeBuilder(commandData, 'group'), commandData);
                for (const subcommandFile of subcommandGroupsList) {
                    if (subcommandFile === 'index.js')
                        continue;
                    commandData = require(`../${rootPath}/${commandDirElement}/${subcommandFile}`).default;
                    const materialized = SuperClient.materializeBuilder(commandData, 'sub');
                    cmdOrGroup.addSubcommand(Object.assign(materialized, commandData));
                }
                command.addSubcommandGroup(cmdOrGroup);
            }
            commandsList.push(command);
        }
        for (const command of commandsList) {
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
exports.default = SuperClient;
