"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEventsCb = exports.callbackDefault = void 0;
const discord_js_1 = require("discord.js");
const Util_1 = require("./Util");
const Context_1 = require("./Context");
/**
 * A default callback function used when nothing is set.
 * @param args The command args.
 * @returns Void.
 */
async function callbackDefault(...args) {
    return void args;
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
exports.defaultEventsCb.set('ready', (client) => {
    (0, Util_1.log)(`Logged in as ${client.user.tag}.`);
});
exports.defaultEventsCb.set('interactionCreate', async (client, interaction) => {
    if (interaction.isButton() || interaction.isAnySelectMenu()) {
        if (interaction.customId.startsWith('autodefer')) {
            await interaction.deferUpdate().catch(Util_1.caught);
        }
    }
    if (interaction.isChatInputCommand()) {
        const command = client.Commands.getCommand(interaction.commandName);
        if (!command)
            return;
        await interaction.deferReply({ ephemeral: true }).catch(Util_1.caught);
        const ctx = new Context_1.default(interaction.channel, command, interaction, interaction.user);
        ctx.command = command;
        ctx.interaction = interaction;
        command.ctx = ctx;
        await ctx.loadLanguage();
        const activeCoolDowns = client.Commands.CoolDowns.coolDowns(interaction.user.id, command.data.name);
        const activeInterfering = client.Commands.Interfering.interfering(interaction.user.id, ...(command.data.interferingCommands || []));
        if (activeCoolDowns.length > 0) {
            const finishTime = String(activeCoolDowns[0][1] / 1000).split('.')[0];
            const translated = ctx.translate('activeCoolDown', command.data.name, finishTime);
            return void (await ctx.reply(translated));
        }
        if (activeInterfering.length > 0) {
            const interferingList = activeInterfering
                .map((i) => `**/${i[0]}**`)
                .join(', ');
            const translated = ctx.translate('activeInterfering', interferingList);
            return void (await ctx.reply(translated));
        }
        const authorized = await command.isAuthorized(interaction);
        if (!authorized)
            return;
        const authorizedAsUnique = await command.isAuthorizedAsUnique(interaction);
        if (!authorizedAsUnique)
            return;
        client.Commands.Interfering.registerInterfering(interaction.user.id, command.data.name, interaction.id);
        client.Commands.CoolDowns.registerCoolDown(interaction.user.id, command.data.name, command.data.coolDown || 0);
        await command.execute(client, interaction, ctx);
    }
    else if (interaction.isModalSubmit()) {
    }
});