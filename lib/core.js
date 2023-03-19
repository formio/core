"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formio = exports.use = exports.useModule = exports.usePlugin = void 0;
require("core-js/features/object/from-entries");
const sdk_1 = require("./sdk");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return sdk_1.Formio; } });
const validator_1 = require("./validator");
const utils_1 = require("./utils");
const base_1 = require("./base");
sdk_1.Formio.render = base_1.render;
sdk_1.Formio.Components = base_1.Components;
sdk_1.Formio.Validator = sdk_1.Formio.Rules = validator_1.Validator;
sdk_1.Formio.Evaluator = utils_1.Evaluator;
sdk_1.Formio.Utils = utils_1.Utils;
sdk_1.Formio.Templates = base_1.Template;
const lodash_1 = require("@formio/lodash");
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
            if (!sdk_1.Formio.options) {
                return;
            }
            sdk_1.Formio.options = (0, lodash_1.merge)(sdk_1.Formio.options, plugin);
            break;
        case 'templates':
            if (!sdk_1.Formio.Templates) {
                return;
            }
            const current = sdk_1.Formio.Templates.framework || 'bootstrap';
            for (const framework of Object.keys(plugin)) {
                sdk_1.Formio.Templates.extendTemplate(framework, plugin[framework]);
            }
            if (plugin[current]) {
                sdk_1.Formio.Templates.current = plugin[current];
            }
            break;
        case 'components':
            if (!sdk_1.Formio.Components) {
                return;
            }
            sdk_1.Formio.Components.setComponents(plugin);
            break;
        case 'framework':
            if (!sdk_1.Formio.Templates) {
                return;
            }
            sdk_1.Formio.Templates.framework = plugin;
            break;
        case 'fetch':
            for (const name of Object.keys(plugin)) {
                sdk_1.Formio.registerPlugin(plugin[name], name);
            }
            break;
        case 'rules':
            if (!sdk_1.Formio.Rules) {
                return;
            }
            sdk_1.Formio.Rules.addRules(plugin);
            break;
        case 'evaluator':
            if (!sdk_1.Formio.Evaluator) {
                return;
            }
            sdk_1.Formio.Evaluator.registerEvaluator(plugin);
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
    for (const key of Object.keys(module)) {
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
function use(...mods) {
    mods.forEach((mod) => {
        if (Array.isArray(mod)) {
            mod.forEach(p => useModule(p));
        }
        else {
            useModule(mod);
        }
    });
}
exports.use = use;
;
sdk_1.Formio.useModule = useModule;
sdk_1.Formio.usePlugin = usePlugin;
sdk_1.Formio.use = use;
const components_1 = __importDefault(require("./components"));
sdk_1.Formio.use(components_1.default);
const modules_1 = __importDefault(require("./modules"));
sdk_1.Formio.use(modules_1.default);
