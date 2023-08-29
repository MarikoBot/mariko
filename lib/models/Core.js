"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIMARY_KEY = exports.defaultData = exports.id = exports.Model = exports.schema = void 0;
const mongoose_1 = require("mongoose");
/**
 * The mongo schema for the interface.
 */
exports.schema = new mongoose_1.Schema({
    id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'id' },
    clientId: { type: String, required: true },
    blacklist: { type: Object, required: true },
    commandPrivileges: { type: Object, required: true },
});
/**
 * The generated model for the schema.
 */
exports.Model = (0, mongoose_1.model)('Core', exports.schema);
/**
 * The default data.
 */
_a = {
    id: null,
    clientId: '1146155436496670820',
    blacklist: {
        '751206188791627877': {
            id: '751206188791627877',
            info: 'total',
            commands: 'all',
        },
    },
    commandPrivileges: {},
}, exports.id = _a.id, exports.defaultData = __rest(_a, ["id"]);
/**
 * The primary key of the table.
 */
exports.PRIMARY_KEY = 'clientId';
