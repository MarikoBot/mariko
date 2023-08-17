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
        this.external = await this.client.Server.Core.getExternalPrivileges(this.data.fullName);
        const missing = [];
        let privileges = '0b0';
        const bitsRecord = {
            forbiddenUsers: '0b10000000',
            uniqueUsers: '0b1000000',
            forbiddenGuilds: '0b100000',
            uniqueGuilds: '0b10000',
            forbiddenRoles: '0b1000',
            uniqueRoles: '0b100',
            forbiddenChannels: '0b10',
            uniqueChannels: '0b1',
        };
        if (interaction.inGuild()) {
            const forbiddenGuild = this.external.forbiddenGuilds && this.external.forbiddenGuilds.includes(interaction.guildId);
            if (forbiddenGuild)
                missing.push('forbiddenGuilds');
            if (this.external.uniqueGuilds) {
                if (this.external.uniqueGuilds.includes(interaction.guildId))
                    privileges = bitsRecord['uniqueUsers'];
                else
                    missing.push('uniqueUsers');
            }
            if (interaction.channel.id) {
                const forbiddenChannel = this.external.forbiddenChannels && this.external.forbiddenChannels.includes(interaction.channel.id);
                if (forbiddenChannel)
                    missing.push('forbiddenChannels');
                if (this.external.uniqueChannels) {
                    if (this.external.uniqueChannels.includes(interaction.channel.id))
                        privileges =
                            Number(privileges) > Number(bitsRecord['uniqueChannels']) ? privileges : bitsRecord['uniqueChannels'];
                    else
                        missing.push('uniqueChannels');
                }
            }
            if (interaction.member) {
                const forbiddenRoles = this.external.forbiddenRoles &&
                    this.external.forbiddenRoles.some((role) => (interaction.member?.roles).cache.has(role));
                if (forbiddenRoles)
                    missing.push('forbiddenRoles');
                if (this.external.uniqueRoles) {
                    if (this.external.uniqueRoles.every((role) => (interaction.member?.roles).cache.has(role)))
                        privileges =
                            Number(privileges) > Number(bitsRecord['uniqueRoles']) ? privileges : bitsRecord['uniqueRoles'];
                    else
                        missing.push('uniqueRoles');
                }
            }
        }
        const forbiddenUser = this.external.forbiddenUsers && this.external.forbiddenUsers.includes(interaction.user.id);
        if (forbiddenUser)
            missing.push('forbiddenUsers');
        if (this.external.uniqueUsers) {
            if (this.external.uniqueUsers.includes(interaction.user.id))
                privileges = Number(privileges) > Number(bitsRecord['uniqueUsers']) ? privileges : bitsRecord['uniqueUsers'];
            else
                missing.push('uniqueUsers');
        }
        const highestMissing = missing.sort((a, b) => Number(bitsRecord[b]) - Number(bitsRecord[a]))[0];
        const isAuth = missing.length > 0 ? Number(highestMissing) < Number(privileges) : true;
        if (!isAuth) {
            await this.ctx.reply(this.ctx.translate('privilegesLocked', `${missing.length}${missing
                .map((e) => Number(bitsRecord[e]))
                .reduce((acc, val) => acc + val, 0)}`));
        }
        return isAuth;
    }
}
exports.default = Command;
