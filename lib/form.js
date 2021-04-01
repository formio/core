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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Formio = exports.use = void 0;
var Formio_1 = require("./Formio");
Object.defineProperty(exports, "Formio", { enumerable: true, get: function () { return Formio_1.Formio; } });
var validator_1 = require("./validator");
var _ = __importStar(require("@formio/lodash"));
Formio_1.Formio.Rules = Formio_1.Formio.Validator = validator_1.Validator;
var Core = __importStar(require("./index"));
var modules_1 = __importDefault(require("./modules"));
for (var prop in Core) {
    if (Core.hasOwnProperty(prop)) {
        Formio_1.Formio[prop] = Core[prop];
    }
}
// Register plugin feature.
var registerPlugin = function (plugin) {
    // Sanity check.
    if (typeof plugin !== 'object') {
        return;
    }
    for (var _i = 0, _a = Object.keys(plugin); _i < _a.length; _i++) {
        var key = _a[_i];
        switch (key) {
            case 'options':
                if (!Formio_1.Formio.options) {
                    return;
                }
                Formio_1.Formio.options = _.merge(Formio_1.Formio.options, plugin.options);
                break;
            case 'templates':
                if (!Formio_1.Formio.Templates) {
                    return;
                }
                var current = plugin.framework || Formio_1.Formio.Templates.framework || 'bootstrap';
                for (var _b = 0, _c = Object.keys(plugin.templates); _b < _c.length; _b++) {
                    var framework = _c[_b];
                    Formio_1.Formio.Templates.extendTemplate(framework, plugin.templates[framework]);
                }
                if (plugin.templates[current]) {
                    Formio_1.Formio.Templates.current = plugin.templates[current];
                }
                break;
            case 'components':
                if (!Formio_1.Formio.Components) {
                    return;
                }
                Formio_1.Formio.Components.setComponents(plugin.components);
                break;
            case 'framework':
                if (!Formio_1.Formio.Templates) {
                    return;
                }
                Formio_1.Formio.Templates.framework = plugin.framework;
                break;
            case 'fetch':
                for (var _d = 0, _e = Object.keys(plugin.fetch); _d < _e.length; _d++) {
                    var name_1 = _e[_d];
                    Formio_1.Formio.registerPlugin(plugin.fetch[name_1], name_1);
                }
                break;
            case 'providers':
                if (!Formio_1.Formio.Providers) {
                    return;
                }
                for (var _f = 0, _g = Object.keys(plugin.providers); _f < _g.length; _f++) {
                    var type = _g[_f];
                    Formio_1.Formio.Providers.addProviders(type, plugin.providers[type]);
                }
                break;
            case 'displays':
                if (!Formio_1.Formio.Displays) {
                    return;
                }
                Formio_1.Formio.Displays.addDisplays(plugin.displays);
                break;
            case 'builders':
                if (!Formio_1.Formio.Builders) {
                    return;
                }
                Formio_1.Formio.Builders.addBuilders(plugin.builders);
                break;
            case 'rules':
                if (!Formio_1.Formio.Rules) {
                    return;
                }
                Formio_1.Formio.Rules.addRules(plugin.rules);
                break;
            case 'evaluator':
                if (!Formio_1.Formio.Evaluator) {
                    return;
                }
                Formio_1.Formio.Evaluator.registerEvaluator(plugin.evaluator);
                break;
            default:
                console.log('Unknown plugin option', key);
        }
    }
};
/**
* Allows passing in plugins as multiple arguments or an array of plugins.
*
* Formio.plugins(plugin1, plugin2, etc);
* Formio.plugins([plugin1, plugin2, etc]);
*/
function use() {
    var plugins = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        plugins[_i] = arguments[_i];
    }
    plugins.forEach(function (plugin) {
        if (Array.isArray(plugin)) {
            plugin.forEach(function (p) { return registerPlugin(p); });
        }
        else {
            registerPlugin(plugin);
        }
    });
}
exports.use = use;
;
Formio_1.Formio.use = use;
Formio_1.Formio.use(modules_1.default);
