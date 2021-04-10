import { Formio } from '@formio/sdk';
import { Validator } from '@formio/validator';
import { Evaluator, Utils } from '@formio/utils';
import { Components, render, Template } from '@formio/core';
(Formio as any).render = render;
(Formio as any).Components = Components;
(Formio as any).Validator = (Formio as any).Rules =  Validator;
(Formio as any).Evaluator = Evaluator;
(Formio as any).Utils = Utils;
(Formio as any).Templates = Template;
import { merge } from '@formio/lodash';

/**
 * Register a specific plugin.
 *
 * @param key
 * @param plugin
 * @returns
 */
export function usePlugin(key: string, plugin: any) {
    switch (key) {
        case 'options':
            if (!(Formio as any).options) {
                return;
            }
            (Formio as any).options = merge((Formio as any).options, plugin);
            break;
        case 'templates':
            if (!(Formio as any).Templates) {
                return;
            }
            const current = (Formio as any).Templates.framework || 'bootstrap';
            for (const framework of Object.keys(plugin)) {
                (Formio as any).Templates.extendTemplate(framework, plugin[framework]);
            }
            if (plugin[current]) {
                (Formio as any).Templates.current = plugin[current];
            }
            break;
        case 'components':
            if (!(Formio as any).Components) {
                return;
            }
            (Formio as any).Components.setComponents(plugin);
            break;
        case 'framework':
            if (!(Formio as any).Templates) {
                return;
            }
            (Formio as any).Templates.framework = plugin;
            break;
        case 'fetch':
            for (const name of Object.keys(plugin)) {
                Formio.registerPlugin(plugin[name], name);
            }
            break;
        case 'rules':
            if (!(Formio as any).Rules) {
                return;
            }
            (Formio as any).Rules.addRules(plugin);
            break;
        case 'evaluator':
            if (!(Formio as any).Evaluator) {
                return;
            }
            (Formio as any).Evaluator.registerEvaluator(plugin);
            break;
        default:
            console.log('Unknown plugin option', key);
    }
};

/**
 * Register a new module.
 *
 * @param module
 * @returns
 */
export function useModule(module: any) {
    // Sanity check.
    if (typeof module !== 'object') {
        return;
    }
    for (const key of Object.keys(module)) {
        usePlugin(key, module[key]);
    }
};

/**
* Allows passing in plugins as multiple arguments or an array of plugins.
*
* Formio.plugins(plugin1, plugin2, etc);
* Formio.plugins([plugin1, plugin2, etc]);
*/
export function use(...mods: any) {
    mods.forEach((mod: any) => {
        if (Array.isArray(mod)) {
            mod.forEach(p => useModule(p));
        }
        else {
            useModule(mod);
        }
    });
};

(Formio as any).useModule = useModule;
(Formio as any).usePlugin = usePlugin;
(Formio as any).use = use;

import components from '@formio/components';
(Formio as any).use(components);
import modules from '@formio/modules';
(Formio as any).use(modules);
export { Formio };
export * from '@formio/modules';
export * from '@formio/model';
export * from '@formio/core';
export * from '@formio/components';
