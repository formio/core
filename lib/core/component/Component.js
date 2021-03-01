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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
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
         * The DOM element references used for component logic.
         */
        _this.refs = {};
        /**
         * The template to render for this component.
         */
        _this.template = function (ctx) { return "<span>" + ctx.t('Unknown Component') + "</span>"; };
        _this.id = "e" + Math.random().toString(36).substring(7);
        _this.component = util_1.util.merge(_this.defaultSchema, _this.component);
        _this.options = Object.assign({
            language: 'en',
            namespace: 'formio'
        }, _this.options);
        if (!_this.options.noInit) {
            _this.init();
        }
        return _this;
    }
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    Component.schema = function (extend) {
        if (extend === void 0) { extend = {}; }
        return util_1.util.merge({
            type: 'component',
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
    Object.defineProperty(Component.prototype, "defaultSchema", {
        get: function () {
            return Component.schema();
        },
        enumerable: false,
        configurable: true
    });
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
     * @param context - The context variables to pass to the interpolation.
     */
    Component.prototype.interpolate = function (template, context) {
        return util_1.Evaluator.interpolate(template, context);
    };
    /**
     * The rendering context.
     * @param context - The existing contexts from parent classes.
     */
    Component.prototype.renderContext = function (context) {
        if (context === void 0) { context = {}; }
        return this.evalContext(context);
    };
    /**
     * Renders this component as an HTML string.
     */
    Component.prototype.render = function (context) {
        if (context === void 0) { context = {}; }
        return this.renderTemplate((this.template || this.component.type), this.renderContext(context));
    };
    /**
     * Returns the template references.
     */
    Component.prototype.getRefs = function () {
        return {};
    };
    /**
     * Loads the elemement references.
     * @param element
     */
    Component.prototype.loadRefs = function (element) {
        var refs = this.getRefs();
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
        return __awaiter(this, void 0, void 0, function () {
            var parent_1, index;
            return __generator(this, function (_a) {
                if (element) {
                    parent_1 = element.parentNode;
                    if (parent_1) {
                        index = Array.prototype.indexOf.call(parent_1.children, element);
                        element.outerHTML = String(this.sanitize(this.render()));
                        element = parent_1.children[index];
                        this.loadRefs(element);
                        this.attached = true;
                    }
                }
                this.element = element;
                return [2 /*return*/, this];
            });
        });
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
            value: function () { return _this.dataValue; },
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
            if (this.component.key) {
                util_1.util.set(this.data, this.component.key, value);
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Bubbles an event to the top.
     * @param event
     * @param args
     */
    Component.prototype.bubble = function (event) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.parent) {
            (_a = this.parent).bubble.apply(_a, __spreadArray([event], args));
        }
        else {
            this.emit.apply(this, __spreadArray([event], args));
        }
    };
    /**
     * Determine if this component has changed values.
     *
     * @param value - The value to compare against the current value.
     */
    Component.prototype.hasChanged = function (value) {
        return String(value) !== String(this.dataValue);
    };
    /**
     * Updates the data model value without setting the view.
     * @param value The value to update within this component.
     * @return boolean true if the value has changed.
     */
    Component.prototype.updateValue = function (value) {
        var changed = this.hasChanged(value);
        this.dataValue = value;
        if (changed) {
            this.bubble('change', this);
        }
        return changed;
    };
    /**
     * Sets the data value and updates the view representation.
     * @param value
     */
    Component.prototype.setValue = function (value) {
        return this.updateValue(value);
    };
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
        this.removeAllListeners();
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
    /**
     * Wrapper method to add an event listener to an HTML element.
     *
     * @param obj
     *   The DOM element to add the event to.
     * @param type
     *   The event name to add.
     * @param func
     *   The callback function to be executed when the listener is triggered.
     * @param persistent
     *   If this listener should persist beyond "destroy" commands.
     */
    Component.prototype.addEventListener = function (obj, type, func) {
        if (!obj) {
            return;
        }
        if ('addEventListener' in obj) {
            obj.addEventListener(type, func, false);
        }
        else if ('attachEvent' in obj) {
            obj.attachEvent("on" + type, func);
        }
        return this;
    };
    /**
     * Remove an event listener from the object.
     *
     * @param obj
     * @param type
     */
    Component.prototype.removeEventListener = function (obj, type, func) {
        if (obj) {
            obj.removeEventListener(type, func);
        }
        return this;
    };
    return Component;
}(eventemitter3_1.default));
exports.Component = Component;
