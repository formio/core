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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var Components_1 = require("../Components");
var Template_1 = require("../Template");
var utils_1 = require("@formio/utils");
var model_1 = require("@formio/model");
var _ = __importStar(require("@formio/lodash"));
function Component(props) {
    if (props === void 0) { props = {}; }
    props = _.merge({
        type: 'component',
        template: false,
        schema: {
            persistent: true,
            protected: false,
        }
    }, props);
    props.schema.type = props.type;
    var ModelClass = props.model || model_1.Model;
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(ExtendedComponent, _super);
            function ExtendedComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
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
                _this.template = props.template;
                /**
                 * An array of attached listeners.
                 */
                _this.attachedListeners = [];
                return _this;
            }
            Object.defineProperty(ExtendedComponent.prototype, "defaultOptions", {
                get: function () {
                    return {
                        language: 'en',
                        namespace: 'formio'
                    };
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ExtendedComponent.prototype, "defaultTemplate", {
                get: function () {
                    return function (ctx) { return "<span>" + ctx.t('Unknown Component') + "</span>"; };
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Interpolate a template string.
             * @param template - The template string to interpolate.
             * @param context - The context variables to pass to the interpolation.
             */
            ExtendedComponent.prototype.interpolate = function (template, context) {
                return utils_1.Evaluator.interpolate(template, context);
            };
            /**
             * The rendering context.
             * @param context - The existing contexts from parent classes.
             */
            ExtendedComponent.prototype.renderContext = function (context) {
                if (context === void 0) { context = {}; }
                if (_super.prototype.renderContext) {
                    return _super.prototype.renderContext.call(this, context);
                }
                return context;
            };
            /**
             * Performs an evaluation using the evaluation context of this component.
             *
             * @param func
             * @param args
             * @param ret
             * @param tokenize
             * @return {*}
             */
            ExtendedComponent.prototype.evaluate = function (func, args, ret, tokenize) {
                if (args === void 0) { args = {}; }
                if (ret === void 0) { ret = ''; }
                if (tokenize === void 0) { tokenize = false; }
                return utils_1.Evaluator.evaluate(func, this.evalContext(args), ret, tokenize);
            };
            /**
             * Renders this component as an HTML string.
             */
            ExtendedComponent.prototype.render = function (context) {
                if (context === void 0) { context = {}; }
                if (_super.prototype.render) {
                    return _super.prototype.render.call(this, context);
                }
                return this.renderTemplate((this.template || this.component.type), this.renderContext(context));
            };
            /**
             * Returns the template references.
             */
            ExtendedComponent.prototype.getRefs = function () {
                if (_super.prototype.getRefs) {
                    return _super.prototype.getRefs.call(this);
                }
                return {};
            };
            /**
             * Loads the elemement references.
             * @param element
             */
            ExtendedComponent.prototype.loadRefs = function (element) {
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
            ExtendedComponent.prototype.attach = function (element) {
                return __awaiter(this, void 0, void 0, function () {
                    var parent, index;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.element && !element) {
                                    element = this.element;
                                }
                                if (!element) {
                                    return [2 /*return*/, this];
                                }
                                parent = element.parentNode;
                                if (!parent) {
                                    return [2 /*return*/, this];
                                }
                                index = Array.prototype.indexOf.call(parent.children, element);
                                element.outerHTML = String(this.sanitize(this.render()));
                                element = parent.children[index];
                                this.element = element;
                                this.loadRefs(this.element);
                                if (!_super.prototype.attach) return [3 /*break*/, 2];
                                return [4 /*yield*/, _super.prototype.attach.call(this, element)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                this.attached = true;
                                return [2 /*return*/, this];
                        }
                    });
                });
            };
            /**
             * Redraw this component.
             * @returns
             */
            ExtendedComponent.prototype.redraw = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (this.element) {
                            this.clear();
                            return [2 /*return*/, this.attach()];
                        }
                        return [2 /*return*/];
                    });
                });
            };
            /**
             * Sanitize an html string.
             *
             * @param string
             * @returns {*}
             */
            ExtendedComponent.prototype.sanitize = function (dirty) {
                return utils_1.sanitize(dirty, this.options);
            };
            Object.defineProperty(ExtendedComponent.prototype, "translations", {
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
            ExtendedComponent.prototype.t = function (str) {
                if (this.translations[str]) {
                    return this.translations[str];
                }
                return str;
            };
            /**
             * The evaluation context for interpolations.
             * @param extend
             */
            ExtendedComponent.prototype.evalContext = function (extend) {
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
            ExtendedComponent.prototype.renderTemplate = function (name, ctx) {
                if (ctx === void 0) { ctx = {}; }
                return Template_1.Template.render(name, this.evalContext(ctx), 'html', this.defaultTemplate);
            };
            /**
             * Determines if the value of this component is redacted from the user as if it is coming from the server, but is protected.
             *
             * @return {boolean|*}
             */
            ExtendedComponent.prototype.isValueRedacted = function () {
                return (this.component.protected ||
                    !this.component.persistent ||
                    (this.component.persistent === 'client-only'));
            };
            /**
             * Sets the data value and updates the view representation.
             * @param value
             */
            ExtendedComponent.prototype.setValue = function (value) {
                var changed = false;
                if (_super.prototype.setValue) {
                    changed = _super.prototype.setValue.call(this, value);
                }
                return this.updateValue(value) || changed;
            };
            /**
             * Returns the main HTML Element for this component.
             */
            ExtendedComponent.prototype.getElement = function () {
                return this.element;
            };
            /**
             * Remove all event handlers.
             */
            ExtendedComponent.prototype.detach = function () {
                this.refs = {};
                this.attached = false;
                this.removeAttachedListeners();
                if (_super.prototype.detach) {
                    _super.prototype.detach.call(this);
                }
            };
            /**
             * Clear an element.
             */
            ExtendedComponent.prototype.clear = function () {
                this.detach();
                utils_1.dom.empty(this.getElement());
                if (_super.prototype.clear) {
                    _super.prototype.clear.call(this);
                }
            };
            /**
             * Appends an element to this component.
             * @param element
             */
            ExtendedComponent.prototype.append = function (element) {
                utils_1.dom.appendTo(element, this.element);
            };
            /**
             * Prepends an element to this component.
             * @param element
             */
            ExtendedComponent.prototype.prepend = function (element) {
                utils_1.dom.prependTo(element, this.element);
            };
            /**
             * Removes an element from this component.
             * @param element
             */
            ExtendedComponent.prototype.removeChild = function (element) {
                utils_1.dom.removeChildFrom(element, this.element);
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
            ExtendedComponent.prototype.addEventListener = function (obj, type, func) {
                if (!obj) {
                    return;
                }
                if ('addEventListener' in obj) {
                    obj.addEventListener(type, func, false);
                }
                else if ('attachEvent' in obj) {
                    obj.attachEvent("on" + type, func);
                }
                this.attachedListeners.push({ obj: obj, type: type, func: func });
                return this;
            };
            /**
             * Remove all the attached listeners.
             */
            ExtendedComponent.prototype.removeAttachedListeners = function () {
                var _this = this;
                this.attachedListeners.forEach(function (item) { return _this.removeEventListener(item.obj, item.type, item.func); });
            };
            /**
             * Remove an event listener from the object.
             *
             * @param obj
             * @param type
             */
            ExtendedComponent.prototype.removeEventListener = function (obj, type, func) {
                if (obj) {
                    obj.removeEventListener(type, func);
                }
                return this;
            };
            return ExtendedComponent;
        }(ModelClass(props)(BaseClass)));
    };
}
exports.Component = Component;
// Add the default component.
Components_1.Components.addDecorator(Component, 'component');
Components_1.Components.addComponent(Component()(), 'component');
