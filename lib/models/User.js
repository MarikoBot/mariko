"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mongoose_1 = require("mongoose");
/**
 * The mongo schema for the interface.
 */
const schema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'id' },
    discordId: { type: String, required: true },
    language: { type: String, required: true },
    subscriptions: { type: Object, required: true },
    rpgPremium: { type: Boolean, required: true },
    globalPremium: { type: Boolean, required: true },
});
/**
 * The generated model for the schema.
 */
exports.Model = (0, mongoose_1.model)('User', schema);
