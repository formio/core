import { Component } from './component/Component';
import { NestedComponent } from './nested/NestedComponent';
import { DataComponent } from './data/DataComponent';
import { ArrayComponent } from './array/ArrayComponent';

/**
 * Manages all of the components within the Form.io renderer.
 */
export class Components {
    /**
     * An array of Components available to be rendered.
     */
    public static components: any = {
        component: Component,
        nested: NestedComponent,
        data: DataComponent,
        array: ArrayComponent
    };

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
    public static createComponent(comp: any, options?: any, data?: any) {
        if (Components.components[comp.type]) {
            return new Components.components[comp.type](comp, options, data);
        }
        else {
            return new Components.components.component(comp, options, data);
        }
    }

    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    public static addComponent(component: any) {
        if (!component) {
            return;
        }
        const comp: any = component.type ? Components.importComponent(component) : component;
        Components.components[comp.schema.type] = comp;
    }

    /**
     * Takes a component JSON definition, and then converts it into a Component class that can
     * be instantiated as well as created with ```createComponent```.
     *
     * For example, you can import an H3 component using the following code.
     *
     * ```ts
     * Components.importComponent({
     *    type: 'h3',
     *    extends: 'html',
     *    schema: {
     *      tag: 'h3'
     *    }
     * });
     * const h3 = Components.createComponent({
     *    type: 'h3',
     *    content: 'This is an H3 header!'
     * });
     * console.log(h3.render()); // Outputs "<h3>This is an H3 header!</h3>"
     * ```
     *
     * @param definition
     */
    public static importComponent(definition: any): any {
        const ext = definition.extends || 'component';
        const base = Components.components[ext];

        // Define the class, and extend the base.
        const newClass = function(component: any, options: any = {}, data: any = {}) {
            base.call(this, component, options, data);
            if (definition.template) {
                this.template = definition.template;
            }
        };
        newClass.prototype = Object.create(base.prototype);
        newClass.prototype.constructor = newClass;
        newClass.schema = function(extend: any = {}) {
            const schema = Object.assign({}, definition.schema, extend);
            return base.schema ? base.schema(schema) : schema;
        };

        // Add the class methods to the prototype.
        for (const key in definition.methods) {
            if (definition.methods.hasOwnProperty(key)) {
                newClass.prototype[key] = function(...args: any): any {
                    if (base.prototype[key]) {
                        return definition.methods[key].call(this, base.prototype[key].bind(this), ...args);
                    }
                    return definition.methods[key].call(this, ...args);
                };
            }
        }

        // Set the default schema.
        Object.defineProperty(newClass.prototype, 'defaultSchema', {
            get: () => {
                return newClass.schema();
            }
        });

        // Add the component to the components array.
        Components.components[definition.type] = newClass;
        return newClass;
    }
}

import '../components';