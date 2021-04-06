import { Formio } from './Formio';
import { Validator } from './validator';
import * as _ from '@formio/lodash';
(Formio as any).Rules = (Formio as any).Validator = Validator;
import * as Core from './index';
import './components/index';
import modules from './modules';
for (let prop in Core) {
    if (Core.hasOwnProperty(prop)) {
        (Formio as any)[prop] = (Core as any)[prop];
    }
}

// Register plugin feature.
const registerPlugin = (plugin: any) => {
    // Sanity check.
    if (typeof plugin !== 'object') {
        return;
    }
    for (const key of Object.keys(plugin)) {
        switch (key) {
            case 'options':
                if (!(Formio as any).options) {
                    return;
                }
                (Formio as any).options = _.merge((Formio as any).options, plugin.options);
                break;
            case 'templates':
                if (!(Formio as any).Templates) {
                    return;
                }
                const current = plugin.framework || (Formio as any).Templates.framework || 'bootstrap';
                for (const framework of Object.keys(plugin.templates)) {
                    (Formio as any).Templates.extendTemplate(framework, plugin.templates[framework]);
                }
                if (plugin.templates[current]) {
                    (Formio as any).Templates.current = plugin.templates[current];
                }
                break;
            case 'components':
                if (!(Formio as any).Components) {
                    return;
                }
                (Formio as any).Components.setComponents(plugin.components);
                break;
            case 'framework':
                if (!(Formio as any).Templates) {
                    return;
                }
                (Formio as any).Templates.framework = plugin.framework;
                break;
            case 'fetch':
                for (const name of Object.keys(plugin.fetch)) {
                    Formio.registerPlugin(plugin.fetch[name], name);
                }
                break;
            case 'providers':
                if (!(Formio as any).Providers) {
                    return;
                }
                for (const type of Object.keys(plugin.providers)) {
                    (Formio as any).Providers.addProviders(type, plugin.providers[type]);
                }
                break;
            case 'displays':
                if (!(Formio as any).Displays) {
                    return;
                }
                (Formio as any).Displays.addDisplays(plugin.displays);
                break;
            case 'builders':
                if (!(Formio as any).Builders) {
                    return;
                }
                (Formio as any).Builders.addBuilders(plugin.builders);
                break;
            case 'rules':
                if (!(Formio as any).Rules) {
                    return;
                }
                (Formio as any).Rules.addRules(plugin.rules);
                break;
            case 'evaluator':
                if (!(Formio as any).Evaluator) {
                    return;
                }
                (Formio as any).Evaluator.registerEvaluator(plugin.evaluator);
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
export function use(...plugins: any) {
    plugins.forEach((plugin: any) => {
        if (Array.isArray(plugin)) {
            plugin.forEach(p => registerPlugin(p));
        }
        else {
            registerPlugin(plugin);
        }
    });
};

(Formio as any).use = use;
(Formio as any).use(modules);
export { Formio }
