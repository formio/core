import { Component } from './component/Component';
import { NestedComponent } from './nested/NestedComponent';
import { DataComponent } from './data/DataComponent';
import { ArrayComponent } from './array/ArrayComponent';
export class Components {
    public static components: any = {
        component: Component,
        nested: NestedComponent,
        data: DataComponent,
        array: ArrayComponent
    };

    public static createComponent(comp: any, options?: any, data?: any) {
        if (Components.components[comp.type]) {
            return new Components.components[comp.type](comp, options, data);
        }
        else {
            return new Components.components.component(comp, options, data);
        }
    }

    public static addComponent(component: any) {
        if (!component) {
            return;
        }
        const comp: any = component.type ? Components.importComponent(component) : component;
        Components.components[comp.schema.type] = comp;
    }

    public static importComponent(definition: any): any {
        const ext = definition.extends || 'component';
        const base = Components.components[ext];

        // Define the class, and extend the base.
        const newClass = function(component: any, options: any = {}, data: any = {}) {
            base.call(this, component, options, data);
            this.template = definition.template;
        };
        newClass.prototype = Object.create(base.prototype);
        newClass.prototype.constructor = newClass;
        newClass.schema = function(extend: any = {}) {
            return base.schema ? base.schema(definition.schema) : Object.assign({}, definition.schema, extend);
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