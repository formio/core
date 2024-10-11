import { Components } from '../base';
import { Template } from '../template';
import module from './index';
for (const name in module.components) {
  if (module.components.hasOwnProperty(name)) {
    Components.addComponent((module as any).components[name], name);
  }
}
import templates from './templates';
Template.addTemplates(templates);
export * from './index';
