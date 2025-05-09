import 'core-js/features/object/from-entries';
import { Formio } from '../sdk';
import { Evaluator, Utils, registerEvaluator } from '../utils';
import { Components, render } from './base';
import { Template } from './template';
import { merge } from 'lodash';
import components from './components';

export default class FormioCore extends Formio {
  static Components = Components;
  static render = render;
  static Evaluator = Evaluator;
  static Utils = Utils;
  static Templates = Template;
  static usePlugin(key: string, plugin: any) {
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
        registerEvaluator(plugin);
        break;
      default:
        console.log('Unknown plugin option', key);
    }
  }

  static useModule(module: any) {
    // Sanity check.
    if (typeof module !== 'object') {
      return;
    }
    for (const key of Object.keys(module)) {
      FormioCore.usePlugin(key, module[key]);
    }
  }

  /**
   * Allows passing in plugins as multiple arguments or an array of plugins.
   *
   * Formio.plugins(plugin1, plugin2, etc);
   * Formio.plugins([plugin1, plugin2, etc]);
   */
  static use(...mods: any) {
    mods.forEach((mod: any) => {
      if (Array.isArray(mod)) {
        mod.forEach((p) => FormioCore.useModule(p));
      } else {
        FormioCore.useModule(mod);
      }
    });
  }
}

FormioCore.use(components);
