"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const Components_1 = require("../Components");
const Template_1 = require("../Template");
const Evaluator_1 = require("../../utils/Evaluator");
const dom = __importStar(require("../../utils/dom"));
const sanitize_1 = require("../../utils/sanitize");
const model_1 = require("../../model");
const object_1 = require("@formio/lodash/lib/object");
function Component(props = {}) {
    props = (0, object_1.merge)({
        type: 'component',
        template: false,
        schema: {
            persistent: true,
            protected: false,
        }
    }, props);
    props.schema.type = props.type;
    const ModelClass = props.model || model_1.Model;
    return function (BaseClass) {
        return class ExtendedComponent extends ModelClass(props)(BaseClass) {
            constructor() {
                super(...arguments);
                /**
                 * Boolean to let us know if this component is attached to the DOM or not.
                 */
                this.attached = false;
                /**
                 * The DOM element references used for component logic.
                 */
                this.refs = {};
                /**
                 * The template to render for this component.
                 */
                this.template = props.template;
                /**
                 * An array of attached listeners.
                 */
                this.attachedListeners = [];
            }
            get defaultOptions() {
                return {
                    language: 'en',
                    namespace: 'formio'
                };
            }
            get defaultTemplate() {
                return (ctx) => `<span>${ctx.t('Unknown Component')}</span>`;
            }
            /**
             * Interpolate a template string.
             * @param template - The template string to interpolate.
             * @param context - The context variables to pass to the interpolation.
             */
            interpolate(template, context) {
                return Evaluator_1.Evaluator.interpolate(template, context);
            }
            /**
             * The rendering context.
             * @param context - The existing contexts from parent classes.
             */
            renderContext(context = {}) {
                if (super.renderContext) {
                    return super.renderContext(context);
                }
                return context;
            }
            /**
             * Performs an evaluation using the evaluation context of this component.
             *
             * @param func
             * @param args
             * @param ret
             * @param tokenize
             * @return {*}
             */
            evaluate(func, args = {}, ret = '', tokenize = false) {
                return Evaluator_1.Evaluator.evaluate(func, this.evalContext(args), ret, tokenize);
            }
            /**
             * Renders this component as an HTML string.
             */
            render(context = {}) {
                if (super.render) {
                    return super.render(context);
                }
                return this.renderTemplate((this.template || this.component.type), this.renderContext(context));
            }
            /**
             * Returns the template references.
             */
            getRefs() {
                if (super.getRefs) {
                    return super.getRefs();
                }
                return {};
            }
            /**
             * Loads the elemement references.
             * @param element
             */
            loadRefs(element) {
                const refs = this.getRefs();
                for (const ref in refs) {
                    if (refs[ref] === 'single') {
                        this.refs[ref] = element.querySelector(`[ref="${ref}"]`);
                    }
                    else {
                        this.refs[ref] = element.querySelectorAll(`[ref="${ref}"]`);
                    }
                }
            }
            /**
             * Renders the component and then attaches this component to the HTMLElement.
             * @param element
             */
            attach(element) {
                const _super = Object.create(null, {
                    attach: { get: () => super.attach }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.element && !element) {
                        element = this.element;
                    }
                    if (!element) {
                        return this;
                    }
                    const parent = element.parentNode;
                    if (!parent) {
                        return this;
                    }
                    const index = Array.prototype.indexOf.call(parent.children, element);
                    element.outerHTML = String(this.sanitize(this.render()));
                    element = parent.children[index];
                    this.element = element;
                    this.loadRefs(this.element);
                    if (_super.attach) {
                        yield _super.attach.call(this, element);
                    }
                    this.attached = true;
                    return this;
                });
            }
            /**
             * Redraw this component.
             * @returns
             */
            redraw() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.element) {
                        this.clear();
                        return this.attach();
                    }
                });
            }
            /**
             * Sanitize an html string.
             *
             * @param string
             * @returns {*}
             */
            sanitize(dirty) {
                return (0, sanitize_1.sanitize)(dirty, this.options);
            }
            /**
             * Get all available translations.
             */
            get translations() {
                if (this.options.language &&
                    this.options.i18n &&
                    this.options.i18n[this.options.language]) {
                    return this.options.i18n[this.options.language];
                }
                return {};
            }
            /**
             * Tranlation method to translate a string being rendered.
             * @param str
             */
            t(str) {
                if (this.translations[str]) {
                    return this.translations[str];
                }
                return str;
            }
            /**
             * The evaluation context for interpolations.
             * @param extend
             */
            evalContext(extend = {}) {
                return Object.assign({
                    instance: this,
                    component: this.component,
                    options: this.options,
                    row: this.data,
                    data: this.root ? this.root.data : this.data,
                    rowIndex: this.rowIndex,
                    value: () => this.dataValue,
                    t: (str) => this.t(str)
                }, extend);
            }
            /**
             * Render a template with provided context.
             * @param name
             * @param ctx
             */
            renderTemplate(name, ctx = {}) {
                return Template_1.Template.render(name, this.evalContext(ctx), 'html', this.defaultTemplate);
            }
            /**
             * Determines if the value of this component is redacted from the user as if it is coming from the server, but is protected.
             *
             * @return {boolean|*}
             */
            isValueRedacted() {
                return (this.component.protected ||
                    !this.component.persistent ||
                    (this.component.persistent === 'client-only'));
            }
            /**
             * Sets the data value and updates the view representation.
             * @param value
             */
            setValue(value) {
                let changed = false;
                if (super.setValue) {
                    changed = super.setValue(value);
                }
                return this.updateValue(value) || changed;
            }
            /**
             * Returns the main HTML Element for this component.
             */
            getElement() {
                return this.element;
            }
            /**
             * Remove all event handlers.
             */
            detach() {
                this.refs = {};
                this.attached = false;
                this.removeAttachedListeners();
                if (super.detach) {
                    super.detach();
                }
            }
            /**
             * Clear an element.
             */
            clear() {
                this.detach();
                dom.empty(this.getElement());
                if (super.clear) {
                    super.clear();
                }
            }
            /**
             * Appends an element to this component.
             * @param element
             */
            append(element) {
                dom.appendTo(element, this.element);
            }
            /**
             * Prepends an element to this component.
             * @param element
             */
            prepend(element) {
                dom.prependTo(element, this.element);
            }
            /**
             * Removes an element from this component.
             * @param element
             */
            removeChild(element) {
                dom.removeChildFrom(element, this.element);
            }
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
            addEventListener(obj, type, func) {
                if (!obj) {
                    return;
                }
                if ('addEventListener' in obj) {
                    obj.addEventListener(type, func, false);
                }
                else if ('attachEvent' in obj) {
                    obj.attachEvent(`on${type}`, func);
                }
                this.attachedListeners.push({ obj, type, func });
                return this;
            }
            /**
             * Remove all the attached listeners.
             */
            removeAttachedListeners() {
                this.attachedListeners.forEach((item) => this.removeEventListener(item.obj, item.type, item.func));
                this.attachedListeners = [];
            }
            /**
             * Remove an event listener from the object.
             *
             * @param obj
             * @param type
             */
            removeEventListener(obj, type, func) {
                if (obj) {
                    obj.removeEventListener(type, func);
                }
                return this;
            }
        };
    };
}
exports.Component = Component;
// Add the default component.
Components_1.Components.addDecorator(Component, 'component');
Components_1.Components.addComponent(Component()(), 'component');
