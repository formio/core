"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var Template_1 = require("../../templates/Template");
var templates_1 = __importDefault(require("../../templates"));
var util_1 = require("../../util");
var eventemitter3_1 = __importDefault(require("eventemitter3"));
/**
 * The base component for all rendered components within Form.io platform.
 */
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    /**
     * @constructor
     * @param component
     * @param options
     * @param data
     */
    function Component(component, options, data) {
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {}; }
        var _this = _super.call(this) || this;
        _this.component = component;
        _this.options = options;
        _this.data = data;
        /**
         * Boolean to let us know if this component is attached to the DOM or not.
         */
        _this.attached = false;
        /**
         * The template to render for this component.
         */
        _this.template = 'component';
        _this.options = Object.assign({
            language: 'en',
            namespace: 'formio'
        }, _this.options);
        _this.init();
        return _this;
    }
    Component.dataContext = function (component, data) {
        return data;
    };
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    Component.schema = function (extend) {
        return Object.assign({
            // The "type" of component.
            type: '',
            // The data key for this component.
            key: ''
        }, extend);
    };
    /**
     * Initializes the component.
     */
    Component.prototype.init = function () {
        this.hook('init');
        this.initTemplate();
    };
    /**
     * Initializes the template used for rendering this component.
     */
    Component.prototype.initTemplate = function () {
        // The template is already established.
        if (this.options.tpl) {
            return;
        }
        if (this.options.template && templates_1.default[this.options.template]) {
            this.options.tpl = new Template_1.Template(templates_1.default[this.options.template]);
        }
        if (!this.options.tpl) {
            this.options.tpl = new Template_1.Template(templates_1.default.bootstrap);
        }
    };
    /**
     * Interpolate a template string.
     * @param template - The template string to interpolate.
     * @param ctx - The context variables to pass to the interpolation.
     */
    Component.prototype.interpolate = function (template, ctx) {
        return util_1.Evaluator.interpolate(template, ctx);
    };
    /**
     * The rendering context.
     * @param extend
     */
    Component.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return this.evalContext(extend);
    };
    /**
     * Renders this component as an HTML string.
     */
    Component.prototype.render = function () {
        return this.renderTemplate(this.template, this.renderContext());
    };
    /**
     * Loads the elemement references.
     * @param element
     * @param refs
     */
    Component.prototype.loadRefs = function (element, refs) {
        for (var ref in refs) {
            if (refs[ref] === 'single') {
                this.refs[ref] = element.querySelector("[ref=\"" + ref + "\"]");
            }
            else {
                this.refs[ref] = element.querySelectorAll("[ref=\"" + ref + "\"]");
            }
        }
    };
    /**
     * Renders the component and then attaches this component to the HTMLElement.
     * @param element
     */
    Component.prototype.attach = function (element) {
        this.element = element;
        if (element) {
            var parent_1 = element.parentNode;
            if (parent_1) {
                var index = Array.prototype.indexOf.call(parent_1.children, element);
                element.outerHTML = String(this.sanitize(this.render()));
                element = parent_1.children[index];
                this.attached = true;
            }
        }
    };
    /**
     * Sanitize an html string.
     *
     * @param string
     * @returns {*}
     */
    Component.prototype.sanitize = function (dirty) {
        return util_1.sanitize(dirty, this.options);
    };
    Object.defineProperty(Component.prototype, "translations", {
        /**
         * Get all available translations.
         */
        get: function () {
            if (this.options.language &&
                this.options.i18n &&
                this.options.i18n[this.options.language]) {
                return this.options.i18n[this.options.language];
            }
            return {};
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Tranlation method to translate a string being rendered.
     * @param str
     */
    Component.prototype.t = function (str) {
        if (this.translations[str]) {
            return this.translations[str];
        }
        return str;
    };
    /**
     * The evaluation context for interpolations.
     * @param extend
     */
    Component.prototype.evalContext = function (extend) {
        var _this = this;
        if (extend === void 0) { extend = {}; }
        return Object.assign({
            instance: this,
            component: this.component,
            options: this.options,
            data: this.data,
            t: function (str) { return _this.t(str); }
        }, extend);
    };
    /**
     * Render a template with provided context.
     * @param name
     * @param ctx
     */
    Component.prototype.renderTemplate = function (name, ctx) {
        if (ctx === void 0) { ctx = {}; }
        if (!this.options.tpl) {
            return 'No template defined.';
        }
        return this.options.tpl.render(name, this.evalContext(ctx));
    };
    /**
     * Allow for options to hook into the functionality of this renderer.
     * @return {*}
     */
    Component.prototype.hook = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.options &&
            this.options.hooks &&
            this.options.hooks[name]) {
            return this.options.hooks[name].apply(this, args);
        }
        else {
            // If this is an async hook instead of a sync.
            var fn = (typeof args[args.length - 1] === 'function') ? args[args.length - 1] : null;
            if (fn) {
                return fn(null, args[1]);
            }
            else {
                return args[1];
            }
        }
    };
    Object.defineProperty(Component.prototype, "dataValue", {
        /**
         * Returns the data value for this component.
         */
        get: function () {
            return util_1.util.get(this.data, this.component.key);
        },
        /**
         * Sets the datavalue for this component.
         */
        set: function (value) {
            util_1.util.set(this.data, this.component.key, value);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the main HTML Element for this component.
     */
    Component.prototype.getElement = function () {
        return this.element;
    };
    /**
     * Remove all event handlers.
     */
    Component.prototype.detach = function () {
        this.refs = {};
        // TO-DO: Detach event listeners.
    };
    /**
     * Clear an element.
     */
    Component.prototype.clear = function () {
        this.detach();
        util_1.dom.empty(this.getElement());
    };
    /**
     * Appends an element to this component.
     * @param element
     */
    Component.prototype.append = function (element) {
        util_1.dom.appendTo(element, this.element);
    };
    /**
     * Prepends an element to this component.
     * @param element
     */
    Component.prototype.prepend = function (element) {
        util_1.dom.prependTo(element, this.element);
    };
    /**
     * Removes an element from this component.
     * @param element
     */
    Component.prototype.removeChild = function (element) {
        util_1.dom.removeChildFrom(element, this.element);
    };
    return Component;
}(eventemitter3_1.default));
exports.Component = Component;
