"use strict";
// noinspection JSUnusedGlobalSymbols
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const v10_1 = require("discord-api-types/v10");
const Util_1 = require("./Util");
const ClientConfig_1 = require("../res/ClientConfig");
/**
 * Represents a context. Includes a channel, an interaction, users.
 */
class Context {
    /**
     * The language id of the main user.
     */
    languageId = 'fr';
    /**
     * The channel where the action occurs.
     */
    channel;
    /**
     * The command associated with the context.
     */
    command;
    /**
     * The interaction, if there is one.
     */
    interaction;
    /**
     * The interaction button, if there is one.
     */
    btn;
    /**
     * The users implicated in the context/action.
     */
    users;
    /**
     * The constructor of the context.
     *
     * @param channel The channel where the action occurs.
     * @param command The command associated with the context.
     * @param interaction The interaction, if there is one.
     * @param users The users implicated in the context/action.
     */
    constructor(channel, command, interaction, ...users) {
        this.channel = channel;
        if (this.command) {
            this.command = command;
        }
        if (this.interaction !== undefined)
            this.interaction = interaction;
        this.users = users;
    }
    /**
     * Transform a string or a BaseMessageOptions into a BaseMessageOptions with the specified color.
     *
     * @param data The data to transform.
     * @returns The transformed data.
     */
    transformMessageData(data) {
        if (typeof data !== 'string')
            return data;
        let color = Util_1.Colors.WHITE;
        let ephemeral = false;
        const extracted = Context.extractDataFromStr(data);
        if ('color' in extracted[0])
            color = Util_1.Colors[extracted[0]['color']];
        if ('ephemeral' in extracted[0])
            ephemeral = eval(extracted[0]['ephemeral']);
        return Object.assign({}, {
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setDescription(extracted[1])
                    .setColor(color)
                    .setAuthor({ name: `@${this.users[0].username}`, iconURL: this.users[0].displayAvatarURL() }),
            ],
            ephemeral,
        });
    }
    /**
     * Extract data from a string. Extract especially tags to apply properties.
     *
     * @param str The string to extract from.
     * @param brackets The brackets to remove the content from.
     * @returns An object with the data extracted and the string without the tags.
     */
    static extractDataFromStr(str, brackets = [ClientConfig_1.default.extBracketsOpen, ClientConfig_1.default.extBracketsClose]) {
        const data = {};
        let finalStr = str;
        for (let i = 0; i < str.split(brackets[0]).length - 1; i++) {
            if (finalStr.split(brackets[0]).length <= 1)
                break;
            const KV = finalStr.split(brackets[0])[1].split(brackets[1])[0];
            const key = KV.split('::')[0];
            const value = KV.split('::')[1];
            finalStr = finalStr.includes(brackets[0])
                ? finalStr.split(brackets[0])[0] + (finalStr.includes(brackets[1]) ? finalStr.split(brackets[1])[1] : '')
                : finalStr;
            data[key] = value;
        }
        return [data, finalStr];
    }
    /**
     * Transform a MenuOptions into a full built StringSelectMenuBuilder.
     *
     * @param menuData The data to transform.
     * @returns The transformed data.
     */
    transformMenuData(menuData) {
        const menu = new discord_js_1.StringSelectMenuBuilder().setCustomId('autoDefer_menu');
        if ('placeholder' in menuData)
            menu.setPlaceholder(menuData.placeholder);
        if ('maxValues' in menuData)
            menu.setMaxValues(menuData.maxValues);
        if ('minValues' in menuData)
            menu.setMinValues(menuData.minValues);
        for (const option of menuData.options) {
            const optionBuilder = new discord_js_1.StringSelectMenuOptionBuilder();
            optionBuilder.setValue(option[0]);
            optionBuilder.setLabel(option[1]);
            if (option.length > 2)
                optionBuilder.setEmoji(option[2]);
            menu.addOptions(optionBuilder);
        }
        return menu;
    }
    /**
     * Transform a ModalOptions into a full built ActionRowBuilder.
     *
     * @param modalData The data to transform.
     * @returns The transformed data.
     */
    transformModalData(modalData) {
        const modal = new discord_js_1.ModalBuilder().setCustomId(modalData.customId).setTitle(modalData.title);
        for (const field of modalData.fields) {
            const textInput = new discord_js_1.TextInputBuilder();
            textInput.setCustomId(field.id);
            textInput.setLabel(field.label);
            textInput.setStyle(field.style);
            if ('minLength' in field)
                textInput.setMinLength(field.minLength);
            if ('maxLength' in field)
                textInput.setMaxLength(field.maxLength);
            if ('placeholder' in field)
                textInput.setPlaceholder(field.placeholder);
            if ('required' in field)
                textInput.setRequired(field.required);
            if ('value' in field)
                textInput.setValue(field.value);
            const inputRow = new discord_js_1.ActionRowBuilder().setComponents(textInput);
            modal.addComponents(inputRow);
        }
        return modal;
    }
    /**
     * Generate two buttons for a choice between accept or cancel.
     *
     * @param buttonsToSet The buttons to set.
     * @returns The generated buttons.
     */
    generateValidOrCancelButtons(buttonsToSet = ['accept', 'decline']) {
        const buttons = [];
        if (buttonsToSet.includes('accept'))
            buttons.push(new discord_js_1.ButtonBuilder().setCustomId('autoDefer_accept').setStyle(v10_1.ButtonStyle['Secondary']).setEmoji('✅'));
        if (buttonsToSet.includes('decline'))
            buttons.push(new discord_js_1.ButtonBuilder().setCustomId('autoDefer_decline').setStyle(v10_1.ButtonStyle['Secondary']).setEmoji('❌'));
        if (buttonsToSet.includes('leave'))
            buttons.push(new discord_js_1.ButtonBuilder().setCustomId('autoDefer_leave').setStyle(v10_1.ButtonStyle['Secondary']).setEmoji('🚪'));
        return buttons;
    }
    /**
     * Create a choice between accept or cancel.
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param buttonsToSet The buttons to set.
     * @param timeout The time before the choice expires.
     * @param reply Whether to reply to the interaction or not.
     * @param messageToEdit The message to reply to if there is one.
     * @returns The choice of the user, or null if not sent.
     */
    async validOrCancelDialog(messageData, buttonsToSet = ['accept', 'decline'], timeout, reply = false, messageToEdit) {
        const buttons = this.generateValidOrCancelButtons(buttonsToSet);
        const row = new discord_js_1.ActionRowBuilder().addComponents(buttons);
        const [response, message] = await this.messageComponentInteraction(this.transformMessageData(messageData), [row], timeout, reply, messageToEdit);
        if (!response)
            return [null, message || null];
        return [response.customId, message];
    }
    /**
     * Create a modal dialog based on an interaction.
     *
     * @param contentToShow The content where will appear the current value.
     * @param modalData The data to show in the modal.
     * @param timeout The time before the choice expires.
     * @param customId The custom id if defined for the modal to show.
     * @param reply Whether to reply to the interaction or not.
     * @param messageToEdit The message to reply to if there is one.
     * @returns The choice of the user, or null if not sent.
     */
    async modalDialog(contentToShow, modalData, timeout, customId = 'modal', reply = false, messageToEdit) {
        const buttons = [
            new discord_js_1.ButtonBuilder().setCustomId('modal').setStyle(v10_1.ButtonStyle['Secondary']).setEmoji('📝'),
        ].concat(this.generateValidOrCancelButtons(['accept', 'leave']));
        const row = new discord_js_1.ActionRowBuilder().addComponents(buttons);
        const modal = this.transformModalData(modalData);
        modal.setCustomId(customId);
        let message;
        let loop = true;
        let response = null;
        let accept = 'leave';
        let value = 'Rien';
        while (loop) {
            message = message ? (await message.fetch().catch(Util_1.clean)) || message : message || null;
            value = message ? (0, Util_1.extractString)(contentToShow[1], (0, Util_1.readEmbeds)(message)) : 'Rien';
            const messageEmbedData = this.transformMessageData(message
                ? contentToShow[0].replace('{value}', (0, Util_1.extractString)(contentToShow[1], (message instanceof discord_js_1.InteractionResponse ? await message.fetch() : message).embeds[0].description))
                : contentToShow[0].replace('{value}', value));
            const answer = (await this.messageComponentInteraction(messageEmbedData, [row], timeout, reply, messageToEdit)) || [null, null];
            if (!answer)
                loop = false;
            else
                [response, message] = answer;
            if (!messageToEdit)
                messageToEdit = message;
            if (!response || !response.customId) {
                loop = false;
                break;
            }
            if (response.customId.includes('leave'))
                loop = false;
            if (response.customId.includes('accept')) {
                message = await this.chosenButton(['autoDefer_accept'], message);
                accept = 'accept';
                loop = false;
                message = message ? (await message.fetch().catch(Util_1.clean)) || message : message || null;
                value = message ? (0, Util_1.extractString)(contentToShow[1], (0, Util_1.readEmbeds)(message)) : 'Rien';
            }
            if (response.customId.includes('modal'))
                await response.showModal(modal).catch(Util_1.clean);
        }
        if (!response)
            return [null, null, message || null];
        return [accept, value, message];
    }
    /**
     * Create a super panel with a select menu to switch pages, and a valid or cancel button.
     * Returns the last page selected, the button clicked and the message.
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param menuData The choices to select from and other data like min and max.
     * @param pageData The pages to switch between.
     * @param buttonsToSet The buttons to set.
     * @param timeout The time before the choice expires.
     * @param reply Whether to reply to the interaction or not.
     * @param messageToEdit The message to reply to if there is one.
     * @returns The choice of the user, or null if not sent.
     */
    async panelDialog(messageData, menuData, pageData, buttonsToSet = ['accept', 'decline'], timeout, reply = false, messageToEdit) {
        const menu = this.transformMenuData(menuData);
        const buttons = this.generateValidOrCancelButtons(buttonsToSet);
        const menuRow = new discord_js_1.ActionRowBuilder().addComponents(menu);
        const buttonsRow = new discord_js_1.ActionRowBuilder().addComponents(buttons);
        let pageFocusedOn = menuData.options[0][0];
        let loop = true;
        let [response, message] = [null, null];
        let accept = 'decline';
        while (loop) {
            const pageContent = pageData.find((page) => page[0] === pageFocusedOn)[1];
            const messageEmbedData = this.transformMessageData(pageContent);
            const answer = (await this.messageComponentInteraction(Object.assign(messageData, messageEmbedData), [menuRow, buttonsRow], timeout, reply, messageToEdit)) || [null, null];
            if (!answer)
                loop = false;
            else
                [response, message] = answer;
            if (!messageToEdit)
                messageToEdit = message;
            if (!response)
                loop = false;
            if (response.isAnySelectMenu())
                pageFocusedOn = response.values[0];
            else if (response.customId) {
                loop = false;
                switch (response.customId) {
                    case 'autoDefer_accept':
                        message = await this.edit(Object.assign(messageData, { components: [buttonsRow] }), message);
                        message = await this.chosenButton(['autoDefer_accept'], message);
                        accept = 'accept';
                        break;
                    case 'autoDefer_decline':
                        message = await this.edit(Object.assign(messageData, { components: [buttonsRow] }), message);
                        message = await this.chosenButton(['autoDefer_decline'], message);
                        accept = 'decline';
                        break;
                    case 'autoDefer_leave':
                        accept = 'leave';
                        break;
                    default:
                        accept = 'leave';
                        break;
                }
            }
        }
        if (!response)
            return [null, null, message || null];
        return [accept, pageFocusedOn, message];
    }
    /**
     * Send/reply to a message and wait for a response.
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param rows The rows to add to the message.
     * @param timeout The time before the choice expires.
     * @param reply Whether to reply to the interaction or not.
     * @param messageToEdit The message to reply to if there is one.
     * @returns The response of the user, or null if not sent.
     */
    async messageComponentInteraction(messageData, rows, timeout, reply = false, messageToEdit) {
        const finaleMessageData = Object.assign(this.transformMessageData(messageData), {
            components: rows,
        });
        let message;
        if (reply)
            message = await this.reply(finaleMessageData);
        else if (!messageToEdit)
            message = await this.send(finaleMessageData);
        else {
            if (messageToEdit instanceof discord_js_1.Message)
                message = await this.edit(finaleMessageData, messageToEdit);
            else if (messageToEdit instanceof discord_js_1.InteractionResponse)
                message = await this.edit(finaleMessageData, await messageToEdit.fetch());
        }
        if (!message)
            return [null, message || null];
        const filter = (interaction) => interaction.user.id === this.users[0].id;
        const response = await message.awaitMessageComponent({ filter, time: timeout }).catch(Util_1.clean);
        if (!response)
            return [null, message || null];
        return [response, message];
    }
    /**
     * Send a message in a text-based channel (text, thread, announcements...).
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @returns The message instance, or null if not sent.
     */
    async send(messageData) {
        if (!this.channel.isTextBased())
            return null;
        const message = await this.channel.send(this.transformMessageData(messageData)).catch(Util_1.clean);
        if (!message)
            return null;
        return message;
    }
    /**
     * Reply to an interaction.
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param interaction The interaction to reply to.
     * @returns The message instance, or null if not sent.
     */
    async reply(messageData, interaction = this.interaction) {
        if (!this.channel.isTextBased())
            return null;
        let message;
        try {
            const transformed = this.transformMessageData(messageData);
            if (!interaction.deferred) {
                message = await interaction.reply(transformed).catch(Util_1.clean);
            }
            else {
                message = await interaction.followUp(transformed).catch(Util_1.clean);
            }
            if (!message)
                return null;
        }
        catch (error) {
            (0, Util_1.caught)(error);
            return null;
        }
        return message;
    }
    /**
     * Edit a message in a text-based channel (text, thread, announcements...).
     *
     * @param messageData The message data to send (Discord.<BaseMessageOptions>).
     * @param message The message to edit.
     * @param ignorePresentFields A boolean that indicates if the components/files need to be removed if the object is not passed.
     * @returns The message instance, or null if not sent.
     */
    async edit(messageData, message, ignorePresentFields = false) {
        if (!this.channel.isTextBased())
            return null;
        messageData = this.transformMessageData(messageData);
        if (!('components' in messageData) && !ignorePresentFields) {
            messageData.components = [];
        }
        if ('files' in messageData && messageData.files.length > 0 && !ignorePresentFields) {
            await message.removeAttachments().catch(Util_1.clean);
        }
        if (!('content' in messageData) && !ignorePresentFields) {
            messageData.content = '';
        }
        if (!message)
            return null;
        const editedMessage = await message.edit(messageData).catch(Util_1.clean);
        if (!editedMessage)
            return null;
        return editedMessage;
    }
    /**
     * Add some content to a message with a single embed OR a content.
     *
     * @param contentToAdd The content to add to the content already written.
     * @param message The message to edit.
     * @param contentOrEmbed Specify which place edit if there are both.
     * @param ignorePresentFields A boolean that indicates if the components/files need to be removed if the object is not passed.
     * @returns The edited message.
     */
    async addContent(contentToAdd, message, contentOrEmbed = 'content', ignorePresentFields = false) {
        if (message instanceof discord_js_1.InteractionResponse)
            message = await message.fetch();
        const hasBoth = message.content && (message.embeds.length > 0 ? !!message.embeds[0].description : false);
        const whatEdit = message.content ? 'content' : 'embed';
        if ((!hasBoth && whatEdit === 'content') || (hasBoth && contentOrEmbed === 'content'))
            return await this.edit({ content: message.content + contentToAdd }, message, ignorePresentFields);
        if ((!hasBoth && whatEdit === 'embed') || (hasBoth && contentOrEmbed === 'embed'))
            return await this.edit(message.embeds[0].description + contentToAdd, message, ignorePresentFields);
    }
    /**
     * Edit the specified buttons from a message and applies a cool animation.
     *
     * @param buttonsId The chosen buttons.
     * @param message The message to edit the buttons from.
     * @returns The message instance, or null if not sent.
     */
    async chosenButton(buttonsId, message) {
        const fullRows = [];
        const componentRows = message.components;
        for (const row of componentRows) {
            const components = row.components;
            if (components.length === 0)
                continue;
            if (components[0].type !== v10_1.ComponentType.Button) {
                const rowUpdated = new discord_js_1.ActionRowBuilder().setComponents(components);
                fullRows.push(rowUpdated);
                continue;
            }
            const newButtons = [];
            for (const button of components) {
                if (button.type !== v10_1.ComponentType.Button)
                    continue;
                const buttonUpdated = new discord_js_1.ButtonBuilder()
                    .setCustomId(button.customId)
                    .setStyle(button.style)
                    .setDisabled(true);
                if (button.label)
                    buttonUpdated.setLabel(button.label);
                if (button.emoji)
                    buttonUpdated.setEmoji(button.emoji);
                if (buttonsId.includes(button.customId)) {
                    if (button.customId.includes('accept'))
                        buttonUpdated.setStyle(v10_1.ButtonStyle['Success']);
                    if (button.customId.includes('decline')) {
                        buttonUpdated.setStyle(v10_1.ButtonStyle['Danger']);
                        buttonUpdated.setEmoji('✖️');
                    }
                    if (button.customId.includes('leave'))
                        buttonUpdated.setStyle(v10_1.ButtonStyle['Primary']);
                }
                newButtons.push(buttonUpdated);
            }
            fullRows.push(new discord_js_1.ActionRowBuilder().addComponents(newButtons));
        }
        return await this.edit({ components: fullRows }, message);
    }
    /**
     * Set the language of the context.
     *
     * @returns Nothing.
     */
    async loadLanguage() {
        if (this.users.length > 0)
            this.languageId = await this.command.client.Servers.User.getLanguage(this.users[0].id);
    }
    /**
     * Use a string from a translation with some variables on it.
     *
     * @param key The string to get the translation from.
     * @param vars The variables to replace on.
     * @returns The translated string.
     */
    translate(key, ...vars) {
        const str = this.command.client.Languages.getStr(key, this.languageId).split(ClientConfig_1.default.varBracketsOpen + ClientConfig_1.default.varBracketsClose);
        let finalStr = str[0];
        if (vars.length > 0) {
            for (let i = 0; i < str.length - 1; i++)
                finalStr += vars[i] + str[i + 1];
            return finalStr;
        }
        else
            return str.join('??');
    }
}
exports.default = Context;
