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
var Components = /** @class */ (function () {
    function Components() {
    }
    Components.createComponent = function (comp, options, data) {
        if (Components.components[comp.type]) {
            return new Components.components[comp.type](comp, options, data);
        }
        else {
            return new Components.components.component(comp, options, data);
        }
    };
    Components.addComponent = function (component) {
        if (!component) {
            return;
        }
        var comp = component.type ? Components.importComponent(component) : component;
        Components.components[comp.schema.type] = comp;
    };
    Components.importComponent = function (definition) {
        var ext = definition.extends || 'component';
        var base = Components.components[ext];
        // Define the class, and extend the base.
        var newClass = function (component, options, data) {
            if (options === void 0) { options = {}; }
            if (data === void 0) { data = {}; }
            base.call(this, component, options, data);
            this.template = definition.template;
        };
        newClass.prototype = Object.create(base.prototype);
        newClass.prototype.constructor = newClass;
        newClass.schema = function (extend) {
            if (extend === void 0) { extend = {}; }
            return base.schema ? base.schema(definition.schema) : Object.assign({}, definition.schema, extend);
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
