"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Components = void 0;
/**
 * Manages all of the components within the Form.io renderer.
 */
var Components = /** @class */ (function () {
    function Components() {
    }
    /**
     * Gets a specific component type.
     *
     * @param type
     * @param from
     * @returns
     */
    Components.component = function (type, from) {
        if (from === void 0) { from = 'components'; }
        if (Components[from][type]) {
            return Components[from][type];
        }
        else {
            return Components[from].component;
        }
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
    Components.create = function (comp, options, data) {
        return new (Components.component(comp.type))(comp, options, data);
    };
    /**
     * Adds a base decorator type component.
     *
     * @param baseComponent
     * @param type
     */
    Components.addBaseComponent = function (baseComponent, type) {
        Components.baseComponents[type] = baseComponent;
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
        if (typeof component !== 'function') {
            return Components.importComponent(component);
        }
        Components.components[component.schema().type] = component;
        return component;
    };
    /**
     * Imports a new component based on the JSON decorator of that component.
     * @param component
     */
    Components.importComponent = function (component) {
        var BaseComp = Components.component(component.extends, 'baseComponents');
        var ExtendedComponent = /** @class */ (function (_super) {
            __extends(ExtendedComponent, _super);
            function ExtendedComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return ExtendedComponent;
        }(BaseComp(component)));
        Components.addComponent(ExtendedComponent);
    };
    /**
     * Render a component attached to an html component.
     *
     * @param element
     * @param component
     * @param options
     * @param data
     */
    Components.render = function (element, component, options, data) {
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {}; }
        return Components.create(component, options, data).attach(element);
    };
    /**
     * An array of Components available to be rendered.
     */
    Components.components = {};
    Components.baseComponents = {};
    return Components;
}());
exports.Components = Components;
