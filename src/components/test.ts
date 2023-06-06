import { Components, Template } from 'base';
import module from './index';
for (let name in module.components) {
    if (module.components.hasOwnProperty(name)) {
        Components.addComponent((module as any).components[name], name);
    }
}
import templates from './templates';
Template.addTemplates(templates);
export * from './index';
