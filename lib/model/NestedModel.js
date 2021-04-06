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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedModel = void 0;
var _ = __importStar(require("@formio/lodash"));
var Model_1 = require("./Model");
function NestedModel(Factory) {
    return function (props) {
        if (props === void 0) { props = {}; }
        if (!props.schema) {
            props.schema = {};
        }
        if (!props.schema.components) {
            props.schema.components = [];
        }
        return /** @class */ (function (_super) {
            __extends(NestedModel, _super);
            function NestedModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * Initialize the nested entity by creating the children.
             */
            NestedModel.prototype.init = function () {
                this.components = [];
                _super.prototype.init.call(this);
                this.createComponents(this.componentData());
            };
            /**
             * Get the component data.
             * @returns
             */
            NestedModel.prototype.componentData = function () {
                return this.data;
            };
            /**
             * Creates a new component entity.
             * @param component
             * @param options
             * @param data
             * @returns
             */
            NestedModel.prototype.createComponent = function (component, options, data) {
                var comp = Factory.create(component, __assign({ noInit: true }, options), data);
                comp.parent = this;
                comp.root = this.root || this;
                comp.init();
                return comp;
            };
            /**
             * Creates the components.
             * @param data
             * @returns
             */
            NestedModel.prototype.createComponents = function (data) {
                var _this = this;
                var added = [];
                (this.component.components || []).forEach(function (comp) {
                    var _a;
                    var newComp = _this.createComponent(comp, _this.options, data);
                    (_a = _this.components) === null || _a === void 0 ? void 0 : _a.push(newComp);
                    added.push(newComp);
                });
                return added;
            };
            /**
             * Removes a child comopnent.
             * @param component
             */
            NestedModel.prototype.removeComponent = function (component) {
                var _this = this;
                (this.components || []).forEach(function (comp, index) {
                    var _a;
                    if (comp === component) {
                        if (comp.detach) {
                            comp.detach();
                        }
                        (_a = _this.components) === null || _a === void 0 ? void 0 : _a.splice(index, 1);
                    }
                });
            };
            Object.defineProperty(NestedModel.prototype, "defaultValue", {
                /**
                 * Get the default value for this nested entity.
                 */
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NestedModel.prototype, "emptyValue", {
                /**
                 * The empty value for this component.
                 *
                 * @return {null}
                 */
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(NestedModel.prototype, "dataValue", {
                /**
                 * Get the datavalue of this component.
                 */
                get: function () {
                    return this.data;
                },
                /**
                 * Set the data value for this nested entity.
                 */
                set: function (value) {
                    this.eachComponentValue(value, function (comp, val) { return (comp.dataValue = val); });
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Perform an iteration over each component within this container component.
             *
             * @param {function} fn - Called for each component
             */
            NestedModel.prototype.eachComponent = function (fn) {
                _.each(this.components, function (component, index) {
                    if (fn(component, index) === false) {
                        return false;
                    }
                });
            };
            /**
             * Iterate through each component value.
             *
             * @param value The context data value.
             * @param fn Callback to be called with the component and the value for that component.
             */
            NestedModel.prototype.eachComponentValue = function (value, fn) {
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
            NestedModel.prototype.setValue = function (value) {
                var changed = false;
                this.eachComponentValue(value, function (comp, val) {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            };
            return NestedModel;
        }(Model_1.Model(props)));
    };
}
exports.NestedModel = NestedModel;
