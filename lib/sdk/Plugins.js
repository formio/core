"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("@formio/lodash");
/**
 * The Form.io Plugins allow external systems to "hook" into the default behaviors of the JavaScript SDK.
 */
class Plugins {
    /**
     * Returns the plugin identity.
     *
     * @param value
     */
    static identity(value) {
        return value;
    }
    /**
     * De-registers a plugin.
     * @param plugin The plugin you wish to deregister.
     */
    static deregisterPlugin(plugin) {
        const beforeLength = Plugins.plugins.length;
        Plugins.plugins = Plugins.plugins.filter((p) => {
            if (p !== plugin && p.__name !== plugin) {
                return true;
            }
            (p.deregister || lodash_1.noop).call(plugin, Plugins.Formio);
            return false;
        });
        return beforeLength !== Plugins.plugins.length;
    }
    /**
     * Registers a new plugin.
     *
     * @param plugin The Plugin object.
     * @param name The name of the plugin you wish to register.
     */
    static registerPlugin(plugin, name) {
        Plugins.plugins.push(plugin);
        Plugins.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
        plugin.__name = name;
        (plugin.init || lodash_1.noop).call(plugin, Plugins.Formio);
    }
    /**
     * Returns a plugin provided the name of the plugin.
     * @param name The name of the plugin you would like to get.
     */
    static getPlugin(name) {
        for (const plugin of Plugins.plugins) {
            if (plugin.__name === name) {
                return plugin;
            }
        }
        return null;
    }
    /**
     * Wait for a plugin function to complete.
     * @param pluginFn - A function within the plugin.
     * @param args
     */
    static pluginWait(pluginFn, ...args) {
        return Promise.all(Plugins.plugins.map((plugin) => (plugin[pluginFn] || lodash_1.noop).call(plugin, ...args)));
    }
    /**
     * Gets a value from a Plugin
     * @param pluginFn
     * @param args
     */
    static pluginGet(pluginFn, ...args) {
        const callPlugin = (index) => {
            const plugin = Plugins.plugins[index];
            if (!plugin) {
                return Promise.resolve(null);
            }
            return Promise.resolve((plugin[pluginFn] || lodash_1.noop).call(plugin, ...args))
                .then((result) => {
                if (!(0, lodash_1.isNil)(result)) {
                    return result;
                }
                return callPlugin(index + 1);
            });
        };
        return callPlugin(0);
    }
    /**
     * Allows a Plugin to alter the behavior of the JavaScript library.
     *
     * @param pluginFn
     * @param value
     * @param args
     */
    static pluginAlter(pluginFn, value, ...args) {
        return Plugins.plugins.reduce((value, plugin) => (plugin[pluginFn] || Plugins.identity)(value, ...args), value);
    }
}
/**
 * An array of Form.io Plugins.
 */
Plugins.plugins = [];
exports.default = Plugins;
