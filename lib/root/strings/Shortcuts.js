"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientConfig_1 = require("../../res/ClientConfig");
/**
 * Default enumerations to reduce strings in translations.
 */
const shortcuts = {
    yellow: `${ClientConfig_1.default.extBracketsOpen}color${ClientConfig_1.default.extSplitter}YELLOW${ClientConfig_1.default.extBracketsClose}`,
    red: `${ClientConfig_1.default.extBracketsOpen}color${ClientConfig_1.default.extSplitter}RED${ClientConfig_1.default.extBracketsClose}`,
    ephemeral: `${ClientConfig_1.default.extBracketsOpen}ephemeral${ClientConfig_1.default.extSplitter}true${ClientConfig_1.default.extBracketsClose}`,
};
exports.default = shortcuts;
