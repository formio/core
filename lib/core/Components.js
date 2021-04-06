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
    Components.component = function (type) {
        if (Components.components[type]) {
            return Components.components[type];
        }
        else {
            return Components.components.component;
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
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    Components.addComponent = function (component, type) {
        if (type === void 0) { type = ''; }
        if (!component) {
            return;
        }
        if (typeof component !== 'function') {
            return Components.importComponent(component);
        }
        Components.components[type || component.schema().type] = component;
        return component;
    };
    Components.importComponent = function (component) {
        var BaseComp = Components.component(component.extends);
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
    return Components;
}());
exports.Components = Components;
