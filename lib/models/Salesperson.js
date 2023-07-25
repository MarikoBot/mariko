"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const mongoose_1 = require("mongoose");
/**
 * The mongo schema for the interface.
 */
const schema = new mongoose_1.Schema({});
/**
 * The generated model for the schema.
 */
exports.Model = (0, mongoose_1.model)('User', schema);
