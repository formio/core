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
exports.modules = exports.Formio = exports.use = exports.useModule = exports.usePlugin = void 0;
var Formio_1 = require("./Formio");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return Formio_1.Formio; } });
var validator_1 = require("./validator");
var index_1 = require("./index");
Formio_1.Formio.render = index_1.render;
Formio_1.Formio.Components = index_1.Components;
Formio_1.Formio.Validator = Formio_1.Formio.Rules = validator_1.Validator;
Formio_1.Formio.Evaluator = index_1.Evaluator;
Formio_1.Formio.Utils = index_1.Utils;
Formio_1.Formio.Templates = index_1.Templates;
var lodash_1 = require("@formio/lodash");
/**
 * Register a specific plugin.
 *
 * @param key
 * @param plugin
 * @returns
 */
function usePlugin(key, plugin) {
    switch (key) {
        case 'options':
            if (!Formio_1.Formio.options) {
                return;
            }
            Formio_1.Formio.options = lodash_1.merge(Formio_1.Formio.options, plugin);
            break;
        case 'templates':
            if (!Formio_1.Formio.Templates) {
                return;
            }
            var current = Formio_1.Formio.Templates.framework || 'bootstrap';
            for (var _i = 0, _a = Object.keys(plugin); _i < _a.length; _i++) {
                var framework = _a[_i];
                Formio_1.Formio.Templates.extendTemplate(framework, plugin[framework]);
            }
            if (plugin[current]) {
                Formio_1.Formio.Templates.current = plugin[current];
            }
            break;
        case 'components':
            if (!Formio_1.Formio.Components) {
                return;
            }
            Formio_1.Formio.Components.setComponents(plugin);
            break;
        case 'framework':
            if (!Formio_1.Formio.Templates) {
                return;
            }
            Formio_1.Formio.Templates.framework = plugin;
            break;
        case 'fetch':
            for (var _b = 0, _c = Object.keys(plugin); _b < _c.length; _b++) {
                var name_1 = _c[_b];
                Formio_1.Formio.registerPlugin(plugin[name_1], name_1);
            }
            break;
        case 'rules':
            if (!Formio_1.Formio.Rules) {
                return;
            }
            Formio_1.Formio.Rules.addRules(plugin);
            break;
        case 'evaluator':
            if (!Formio_1.Formio.Evaluator) {
                return;
            }
            Formio_1.Formio.Evaluator.registerEvaluator(plugin);
            break;
        default:
            console.log('Unknown plugin option', key);
    }
}
exports.usePlugin = usePlugin;
;
/**
 * Register a new module.
 *
 * @param module
 * @returns
 */
function useModule(module) {
    // Sanity check.
    if (typeof module !== 'object') {
        return;
    }
    for (var _i = 0, _a = Object.keys(module); _i < _a.length; _i++) {
        var key = _a[_i];
        usePlugin(key, module[key]);
    }
}
exports.useModule = useModule;
;
/**
* Allows passing in plugins as multiple arguments or an array of plugins.
*
* Formio.plugins(plugin1, plugin2, etc);
* Formio.plugins([plugin1, plugin2, etc]);
*/
function use() {
    var mods = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mods[_i] = arguments[_i];
    }
    mods.forEach(function (mod) {
        if (Array.isArray(mod)) {
            mod.forEach(function (p) { return useModule(p); });
        }
        else {
            useModule(mod);
        }
    });
}
exports.use = use;
;
Formio_1.Formio.useModule = useModule;
Formio_1.Formio.usePlugin = usePlugin;
Formio_1.Formio.use = use;
var modules_1 = __importDefault(require("./modules"));
exports.modules = modules_1.default;
Formio_1.Formio.use(modules_1.default);
__exportStar(require("./model"), exports);
__exportStar(require("./core"), exports);
__exportStar(require("./components"), exports);