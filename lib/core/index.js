"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Components = void 0;
var Component_1 = require("./component/Component");
var NestedComponent_1 = require("./nested/NestedComponent");
var DataComponent_1 = require("./data/DataComponent");
var ArrayComponent_1 = require("./array/ArrayComponent");
/**
 * Manages all of the components within the Form.io renderer.
 */
var Components = /** @class */ (function () {
    function Components() {
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
    Components.createComponent = function (comp, options, data) {
        if (Components.components[comp.type]) {
            return new Components.components[comp.type](comp, options, data);
        }
        else {
            return new Components.components.component(comp, options, data);
        }
    };
    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    Components.addComponent = function (component) {
        if (!component) {
            return;
        }
        var comp = component.type ? Components.importComponent(component) : component;
        Components.components[comp.schema.type] = comp;
    };
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
    Components.importComponent = function (definition) {
        var ext = definition.extends || 'component';
        var base = Components.components[ext];
        // Define the class, and extend the base.
        var newClass = function (component, options, data) {
            if (options === void 0) { options = {}; }
            if (data === void 0) { data = {}; }
            base.call(this, component, options, data);
            if (definition.template) {
                this.template = definition.template;
            }
        };
        newClass.prototype = Object.create(base.prototype);
        newClass.prototype.constructor = newClass;
        newClass.schema = function (extend) {
            if (extend === void 0) { extend = {}; }
            var schema = Object.assign({}, definition.schema, extend);
            return base.schema ? base.schema(schema) : schema;
        };
        var _loop_1 = function (key) {
            if (definition.methods.hasOwnProperty(key)) {
                newClass.prototype[key] = function () {
                    var _a, _b;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (base.prototype[key]) {
                        return (_a = definition.methods[key]).call.apply(_a, __spreadArray([this, base.prototype[key].bind(this)], args));
                    }
                    return (_b = definition.methods[key]).call.apply(_b, __spreadArray([this], args));
                };
            }
        };
        // Add the class methods to the prototype.
        for (var key in definition.methods) {
            _loop_1(key);
        }
        // Set the default schema.
        Object.defineProperty(newClass.prototype, 'defaultSchema', {
            get: function () {
                return newClass.schema();
            }
        });
        // Add the component to the components array.
        Components.components[definition.type] = newClass;
        return newClass;
    };
    /**
     * An array of Components available to be rendered.
     */
    Components.components = {
        component: Component_1.Component,
        nested: NestedComponent_1.NestedComponent,
        data: DataComponent_1.DataComponent,
        array: ArrayComponent_1.ArrayComponent
    };
    return Components;
}());
exports.Components = Components;
require("../components");
