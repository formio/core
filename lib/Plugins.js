"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util/util");
/**
 * The Form.io Plugins allow external systems to "hook" into the default behaviors of the JavaScript SDK.
 */
var Plugins = /** @class */ (function () {
    function Plugins() {
    }
    /**
     * Returns the plugin identity.
     *
     * @param value
     */
    Plugins.identity = function (value) {
        return value;
    };
    /**
     * De-registers a plugin.
     * @param plugin The plugin you wish to deregister.
     */
    Plugins.deregisterPlugin = function (plugin) {
        var beforeLength = Plugins.plugins.length;
        Plugins.plugins = Plugins.plugins.filter(function (p) {
            if (p !== plugin && p.__name !== plugin) {
                return true;
            }
            (p.deregister || util_1.noop).call(plugin, Plugins.Formio);
            return false;
        });
        return beforeLength !== Plugins.plugins.length;
    };
    /**
     * Registers a new plugin.
     *
     * @param plugin The Plugin object.
     * @param name The name of the plugin you wish to register.
     */
    Plugins.registerPlugin = function (plugin, name) {
        Plugins.plugins.push(plugin);
        Plugins.plugins.sort(function (a, b) { return (b.priority || 0) - (a.priority || 0); });
        plugin.__name = name;
        (plugin.init || util_1.noop).call(plugin, Plugins.Formio);
    };
    /**
     * Returns a plugin provided the name of the plugin.
     * @param name The name of the plugin you would like to get.
     */
    Plugins.getPlugin = function (name) {
        for (var _i = 0, _a = Plugins.plugins; _i < _a.length; _i++) {
            var plugin = _a[_i];
            if (plugin.__name === name) {
                return plugin;
            }
        }
        return null;
    };
    /**
     * Wait for a plugin function to complete.
     * @param pluginFn - A function within the plugin.
     * @param args
     */
    Plugins.pluginWait = function (pluginFn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return Promise.all(Plugins.plugins.map(function (plugin) {
            var _a;
            return (_a = (plugin[pluginFn] || util_1.noop)).call.apply(_a, __spreadArray([plugin], args));
        }));
    };
    /**
     * Gets a value from a Plugin
     * @param pluginFn
     * @param args
     */
    Plugins.pluginGet = function (pluginFn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var callPlugin = function (index) {
            var _a;
            var plugin = Plugins.plugins[index];
            if (!plugin) {
                return Promise.resolve(null);
            }
            return Promise.resolve((_a = (plugin[pluginFn] || util_1.noop)).call.apply(_a, __spreadArray([plugin], args)))
                .then(function (result) {
                if (!util_1.isNil(result)) {
                    return result;
                }
                return callPlugin(index + 1);
            });
        };
        return callPlugin(0);
    };
    /**
     * Allows a Plugin to alter the behavior of the JavaScript library.
     *
     * @param pluginFn
     * @param value
     * @param args
     */
    Plugins.pluginAlter = function (pluginFn, value) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return Plugins.plugins.reduce(function (value, plugin) {
            return (plugin[pluginFn] || Plugins.identity).apply(void 0, __spreadArray([value], args));
        }, value);
    };
    /**
     * An array of Form.io Plugins.
     */
    Plugins.plugins = [];
    return Plugins;
}());
exports.default = Plugins;
