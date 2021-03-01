import { Components } from './core';
import './components/import';
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