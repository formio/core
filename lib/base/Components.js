"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.Components = void 0;
/**
 * Manages all of the components within the Form.io renderer.
 */
class Components {
    /**
     * Gets a specific component type.
     *
     * @param type
     * @param from
     * @returns
     */
    static component(type, from = 'components') {
        if (Components[from][type]) {
            return Components[from][type];
        }
        else {
            return Components[from].component;
        }
    }
    /**
     * Create a new component.
     *
     * ```ts
     * const htmlComp = Components.createComponent({
     *    type: 'html',
     *    tag: 'p',
     *    content: 'This is a test.'
     * })
     * ```
     *
     * @param comp The component JSON you wish to create.
     * @param options The options to pass to this component.
     * @param data The data you wish to provide to this component.
     */
    static create(comp, options, data) {
        return new (Components.component(comp.type))(comp, options, data);
    }
    /**
     * Adds a base decorator type component.
     *
     * @param baseComponent
     * @param type
     */
    static addDecorator(decorator, type) {
        Components.decorators[type] = decorator;
    }
    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    static addComponent(component, type) {
        if (!component) {
            return;
        }
        if (typeof component !== 'function') {
            return Components.importComponent(component);
        }
        Components.components[type] = component;
        return component;
    }
    /**
     * Imports a new component based on the JSON decorator of that component.
     * @param component
     */
    static importComponent(props = {}) {
        const Decorator = Components.component(props.extends, 'decorators');
        let ExtendedComponent = class ExtendedComponent {
        };
        ExtendedComponent = __decorate([
            Decorator(props)
        ], ExtendedComponent);
        Components.addComponent(ExtendedComponent, props.type);
    }
    /**
     * Sets the components used within this renderer.
     * @param components
     */
    static setComponents(components) {
        Object.assign(Components.components, components);
    }
}
exports.Components = Components;
/**
 * An array of Components available to be rendered.
 */
Components.components = {};
Components.decorators = {};
/**
 * Render a component attached to an html component.
 *
 * @param element
 * @param component
 * @param options
 * @param data
 */
function render(element, component, options = {}, data = {}) {
    return Components.create(component, options, data).attach(element);
}
exports.render = render;
