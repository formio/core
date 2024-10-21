import { noop, isNil } from 'lodash';

/**
 * The plugin initialization function, which will receive the Formio interface as its first argument.
 */
export interface PluginInitFunction {
  /**
   * @param Formio - The Formio interface class.
   */
  (Formio: any): void;
}

/**
 * Function that is called when the plugin is deregistered.
 */
export interface PluginDeregisterFunction {
  /**
   * @param Formio The Formio interface class.
   */
  (Formio: any): void;
}

/**
 * A Formio Plugin interface.
 */
export interface Plugin {
  /**
   * The name of the plugin.
   */
  __name: string;

  /**
   * The priority of this plugin.
   */
  priority: number;

  /**
   * An initialization function called when registered with Formio.
   */
  init: PluginInitFunction;

  /**
   * Called when the plugin is deregistered.
   */
  deregister: PluginDeregisterFunction;
}

/**
 * The Form.io Plugins allow external systems to "hook" into the default behaviors of the JavaScript SDK.
 */
export default class Plugins {
  /**
   * An array of Form.io Plugins.
   */
  public static plugins: Array<Plugin> = [];

  /**
   * The Formio class.
   */
  public static Formio: any;

  /**
   * Returns the plugin identity.
   *
   * @param value
   */
  static identity(value: string) {
    return value;
  }

  /**
   * De-registers a plugin.
   * @param plugin The plugin you wish to deregister.
   */
  static deregisterPlugin(plugin: Plugin | string) {
    const beforeLength = Plugins.plugins.length;
    Plugins.plugins = Plugins.plugins.filter((p) => {
      if (p !== plugin && p.__name !== plugin) {
        return true;
      }

      (p.deregister || noop).call(plugin, Plugins.Formio);
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
  static registerPlugin(plugin: Plugin, name: string) {
    Plugins.plugins.push(plugin);
    Plugins.plugins.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    plugin.__name = name;
    (plugin.init || noop).call(plugin, Plugins.Formio);
  }

  /**
   * Returns a plugin provided the name of the plugin.
   * @param name The name of the plugin you would like to get.
   */
  static getPlugin(name: string) {
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
  static pluginWait(pluginFn: any, ...args: any[]) {
    return Promise.all(
      Plugins.plugins.map((plugin: Plugin) =>
        ((plugin as any)[pluginFn] || noop).call(plugin, ...args),
      ),
    );
  }

  /**
   * Gets a value from a Plugin
   * @param pluginFn
   * @param args
   */
  static pluginGet(pluginFn: any, ...args: any[]) {
    const callPlugin = (index: any): any => {
      const plugin = Plugins.plugins[index];

      if (!plugin) {
        return Promise.resolve(null);
      }

      return Promise.resolve(((plugin as any)[pluginFn] || noop).call(plugin, ...args)).then(
        (result) => {
          if (!isNil(result)) {
            return result;
          }

          return callPlugin(index + 1);
        },
      );
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
  static pluginAlter(pluginFn: any, value: any, ...args: any[]) {
    return Plugins.plugins.reduce(
      (value, plugin) => ((plugin as any)[pluginFn] || Plugins.identity)(value, ...args),
      value,
    );
  }
}
