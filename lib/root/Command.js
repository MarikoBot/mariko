"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The class that represents a command.
 */
class Command {
    /**
     * The client instance.
     */
    client;
    /**
     * The data of the command.
     */
    data;
    /**
     * The function that will be executed when the command is called.
     */
    execute;
    /**
     * The context of the command.
     */
    ctx;
    /**
     * The external data for the command.
     */
    external;
    /**
     * The constructor of the command.
     */
    constructor(client, data) {
        this.client = client;
        this.data = data;
        this.execute = data.execute;
    }
    /**
     * End the command. Call it when you want the command to be considered as finished and remove it from the interfering queue.
     * @returns Void.
     */
    end() {
        if (!this.ctx)
            return;
        if (!this.ctx.interaction)
            return;
        this.client.Commands.Interfering.removeInterfering(this.ctx.interaction.user.id, this.ctx.interaction.id);
    }
    /**
     * Returns if the user is authorized to execute the command.
     * @param interaction The interaction of the command.
     * @returns If the user can execute the command.
     */
    async isAuthorized(interaction) {
        this.external = await this.client.Server.Core.getExternalPrivileges(this.data.name);
        if (interaction.inGuild()) {
            const forbiddenGuild = this.external.forbiddenGuilds && this.external.forbiddenGuilds.includes(interaction.guildId);
            if (forbiddenGuild) {
                await this.ctx.reply(this.ctx.translate('forbiddenGuild'));
                return false;
            }
            if (interaction.channel.id) {
                const forbiddenChannel = this.external.forbiddenChannels && this.external.forbiddenChannels.includes(interaction.channel.id);
                if (forbiddenChannel) {
                    await this.ctx.reply(this.ctx.translate('forbiddenChannel'));
                    return false;
                }
            }
            if (interaction.member) {
                const forbiddenRoles = this.external.forbiddenRoles &&
                    this.external.forbiddenRoles.some((role) => (interaction.member?.roles).cache.has(role));
                if (forbiddenRoles) {
                    await this.ctx.reply(this.ctx.translate('forbiddenRole'));
                    return false;
                }
            }
        }
        const forbiddenUser = this.external.forbiddenUsers && this.external.forbiddenUsers.includes(interaction.user.id);
        if (forbiddenUser) {
            await this.ctx.reply(this.ctx.translate('forbiddenUser'));
            return false;
        }
        return true;
    }
    /**
     * Returns if the user is authorized in case of unique concept to execute the command.
     * @param interaction The interaction of the command.
     * @returns If the user can execute the command.
     */
    async isAuthorizedAsUnique(interaction) {
        this.external = await this.client.Server.Core.getExternalPrivileges(this.data.fullName);
        if (interaction.inGuild()) {
            const uniqueGuild = this.external.uniqueGuilds && !this.external.uniqueGuilds.includes(interaction.guildId);
            if (uniqueGuild) {
                await this.ctx.reply(this.ctx.translate('uniqueGuild'));
                return false;
            }
            if (interaction.channel.id) {
                const uniqueChannel = this.external.uniqueChannels && !this.external.uniqueChannels.includes(interaction.channel.id);
                if (uniqueChannel) {
                    await this.ctx.reply(this.ctx.translate('uniqueChannel'));
                    return false;
                }
            }
            if (interaction.member) {
                const uniqueRoles = this.external.uniqueRoles &&
                    this.external.uniqueRoles.every((role) => !(interaction.member?.roles).cache.has(role));
                if (uniqueRoles) {
                    await this.ctx.reply(this.ctx.translate('uniqueRole'));
                    return false;
                }
            }
        }
        const uniqueUser = this.external.uniqueUsers && !this.external.uniqueUsers.includes(interaction.user.id);
        if (uniqueUser) {
            await this.ctx.reply(this.ctx.translate('uniqueUser'));
            return false;
        }
        return true;
    }
}
exports.default = Command;
