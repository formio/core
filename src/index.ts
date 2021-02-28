import { Components } from './core';
import * as comps from './components';
for (let i in comps) {
    if (comps.hasOwnProperty(i)) {
        Components.importComponent((comps as any)[i]);
    }
}
export function render(
    element: HTMLElement,
    component: any,
    options: any = {},
    data: any = {}
) {
    return Components.createComponent(component, options, data).attach(element);
}

export { Components };
export * as Util from './util';
export * as Templates from './templates';
export { Template } from './templates/Template';