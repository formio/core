"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@formio/core");
var index_1 = __importDefault(require("./index"));
for (var name_1 in index_1.default.components) {
    if (index_1.default.components.hasOwnProperty(name_1)) {
        core_1.Components.addComponent(index_1.default.components[name_1], name_1);
    }
}
var templates_1 = __importDefault(require("./templates"));
core_1.Template.addTemplates(templates_1.default);
__exportStar(require("./index"), exports);
