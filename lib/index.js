"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = exports.Templates = exports.Util = exports.Components = exports.render = void 0;
var core_1 = require("./core");
Object.defineProperty(exports, "Components", { enumerable: true, get: function () { return core_1.Components; } });
function render(element, component, options, data) {
    if (options === void 0) { options = {}; }
    if (data === void 0) { data = {}; }
    return core_1.Components.createComponent(component, options, data).attach(element);
}
exports.render = render;
exports.Util = __importStar(require("./util"));
exports.Templates = __importStar(require("./templates"));
var Template_1 = require("./templates/Template");
Object.defineProperty(exports, "Template", { enumerable: true, get: function () { return Template_1.Template; } });
