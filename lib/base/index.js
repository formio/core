"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = exports.ArrayComponent = exports.DataComponent = exports.NestedComponent = exports.Component = exports.render = exports.Components = void 0;
var Components_1 = require("./Components");
Object.defineProperty(exports, "Components", { enumerable: true, get: function () { return Components_1.Components; } });
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return Components_1.render; } });
var Component_1 = require("./component/Component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return Component_1.Component; } });
var NestedComponent_1 = require("./nested/NestedComponent");
Object.defineProperty(exports, "NestedComponent", { enumerable: true, get: function () { return NestedComponent_1.NestedComponent; } });
var DataComponent_1 = require("./data/DataComponent");
Object.defineProperty(exports, "DataComponent", { enumerable: true, get: function () { return DataComponent_1.DataComponent; } });
var ArrayComponent_1 = require("./array/ArrayComponent");
Object.defineProperty(exports, "ArrayComponent", { enumerable: true, get: function () { return ArrayComponent_1.ArrayComponent; } });
var Template_1 = require("./Template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return Template_1.Template; } });
__exportStar(require("../model"), exports);
