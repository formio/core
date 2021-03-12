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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.NestedComponent = void 0;
var Component_1 = require("../component/Component");
var __1 = require("..");
var _ = __importStar(require("../../util/lodash"));
/**
 * Provides a nested component structure, where components can be nested within other components.
 */
var NestedComponent = /** @class */ (function (_super) {
    __extends(NestedComponent, _super);
    function NestedComponent(component, options, data) {
        if (component === void 0) { component = {}; }
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, component, __assign({ noInit: true }, options), data) || this;
        _this.template = function (ctx) { return "<div ref=\"nested\">" + ctx.instance.renderComponents() + "</div>"; };
        _this.components = [];
        if (!options.noInit) {
            _this.init();
        }
        return _this;
    }
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    NestedComponent.schema = function (extend) {
        if (extend === void 0) { extend = {}; }
        if (!extend.components) {
            extend.components = [];
        }
        return Component_1.Component.schema(extend);
    };
    /**
     * Initialize the nested component as well as create all nested components.
     */
    NestedComponent.prototype.init = function () {
        _super.prototype.init.call(this);
        this.initComponents();
    };
    Object.defineProperty(NestedComponent.prototype, "defaultSchema", {
        /**
         * Return the default schema for this component.
         */
        get: function () {
            return NestedComponent.schema();
        },
        enumerable: false,
        configurable: true
    });
    NestedComponent.prototype.getComponents = function () {
        return this.components || [];
    };
    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} fn - Called for each component
     */
    NestedComponent.prototype.eachComponent = function (fn) {
        _.each(this.getComponents(), function (component, index) {
            if (fn(component, index) === false) {
                return false;
            }
        });
    };
    /**
     * Attach a html element to this nestd component.
     * @param element
     */
    NestedComponent.prototype.attach = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var promises_1, children;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.attach.call(this, element)];
                    case 1:
                        _a.sent();
                        if (!this.element) return [3 /*break*/, 3];
                        promises_1 = [];
                        children = this.element.querySelectorAll("[data-within=\"" + this.id + "\"]");
                        Array.prototype.slice.call(children).forEach(function (child, index) {
                            promises_1.push(_this.components[index].attach(child));
                        });
                        return [4 /*yield*/, Promise.all(promises_1)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Detach components.
     */
    NestedComponent.prototype.detach = function () {
        _super.prototype.detach.call(this);
        this.eachComponent(function (comp) { return comp.detach(); });
    };
    NestedComponent.prototype.componentData = function () {
        return this.data;
    };
    NestedComponent.prototype.removeComponent = function (component) {
        var _this = this;
        (this.components || []).forEach(function (comp, index) {
            var _a;
            if (comp === component) {
                comp.detach();
                (_a = _this.components) === null || _a === void 0 ? void 0 : _a.splice(index, 1);
            }
        });
    };
    NestedComponent.prototype.createComponent = function (component, data) {
        var comp = __1.Components.create(component, __assign({ noInit: true }, this.options), data);
        comp.parent = this;
        comp.root = this.root || this;
        comp.init();
        return comp;
    };
    NestedComponent.prototype.createComponents = function (data) {
        var _this = this;
        var added = [];
        (this.component.components || []).forEach(function (comp) {
            var _a;
            var newComp = _this.createComponent(comp, data);
            (_a = _this.components) === null || _a === void 0 ? void 0 : _a.push(newComp);
            added.push(newComp);
        });
        return added;
    };
    NestedComponent.prototype.initComponents = function () {
        this.createComponents(this.componentData());
    };
    NestedComponent.prototype.renderComponents = function () {
        var _this = this;
        var _a;
        return (_a = this.components) === null || _a === void 0 ? void 0 : _a.reduce(function (tpl, comp) {
            return tpl + comp.render().replace(/(<[^\>]+)/, "$1 data-within=\"" + _this.id + "\"");
        }, '');
    };
    Object.defineProperty(NestedComponent.prototype, "dataValue", {
        /**
         * Get the datavalue of this component.
         */
        get: function () {
            return this.data;
        },
        /**
         * Sets the datavalue for this component.
         */
        set: function (value) {
            this.eachComponentValue(value, function (comp, val) {
                comp.dataValue = val;
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Iterate through each component value.
     *
     * @param value The context data value.
     * @param fn Callback to be called with the component and the value for that component.
     */
    NestedComponent.prototype.eachComponentValue = function (value, fn) {
        if (Object.keys(value).length) {
            this.eachComponent(function (comp) {
                fn(comp, _.get(value, comp.component.key));
            });
        }
    };
    /**
     * Sets the value for a data component.
     *
     * @param value
     */
    NestedComponent.prototype.setValue = function (value) {
        var changed = false;
        this.eachComponentValue(value, function (comp, val) {
            changed = comp.setValue(val) || changed;
        });
        return changed;
    };
    return NestedComponent;
}(Component_1.Component));
exports.NestedComponent = NestedComponent;
