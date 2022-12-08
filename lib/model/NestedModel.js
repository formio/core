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
exports.NestedModel = void 0;
var _ = __importStar(require("@formio/lodash"));
var Model_1 = require("./Model");
function NestedModel(props) {
    if (props === void 0) { props = {}; }
    if (!props.schema) {
        props.schema = {};
    }
    if (!props.schema.components) {
        props.schema.components = [];
    }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(BaseNestedModel, _super);
            function BaseNestedModel() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            /**
             * Initialize the nested entity by creating the children.
             */
            BaseNestedModel.prototype.init = function () {
                _super.prototype.init.call(this);
                this.components = [];
                this.createComponents(this.componentData());
            };
            /**
             * Get the component data.
             * @returns
             */
            BaseNestedModel.prototype.componentData = function () {
                return this.data;
            };
            /**
             * Creates a new component entity.
             * @param component
             * @param options
             * @param data
             * @returns
             */
            BaseNestedModel.prototype.createComponent = function (component, options, data) {
                if (!props.factory) {
                    console.log('Cannot create components. No "factory" provided.');
                    return null;
                }
                var comp = props.factory.create(component, __assign({ noInit: true }, options), data);
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
            BaseNestedModel.prototype.createComponents = function (data, eachComp) {
                var _this = this;
                var added = [];
                (this.component.components || []).forEach(function (comp) {
                    var newComp = _this.createComponent(comp, _this.options, data);
                    if (newComp) {
                        _this.components.push(newComp);
                        added.push(newComp);
                        if (eachComp) {
                            eachComp(newComp);
                        }
                    }
                });
                return added;
            };
            /**
             * Removes a child comopnent.
             * @param component
             */
            BaseNestedModel.prototype.removeComponent = function (component) {
                var _this = this;
                (this.components || []).forEach(function (comp, index) {
                    if (comp === component) {
                        if (comp.detach) {
                            comp.detach();
                        }
                        _this.components.splice(index, 1);
                    }
                });
            };
            /**
             * Checks for the validity of this component and all components within this component.
             * @returns
             */
            BaseNestedModel.prototype.checkValidity = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.components.reduce(function (valid, comp) {
                                return valid && comp.checkValidity();
                            }, this.checkComponentValidity())];
                    });
                });
            };
            Object.defineProperty(BaseNestedModel.prototype, "defaultValue", {
                /**
                 * Get the default value for this nested entity.
                 */
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseNestedModel.prototype, "emptyValue", {
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
            Object.defineProperty(BaseNestedModel.prototype, "dataValue", {
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
            BaseNestedModel.prototype.eachComponent = function (fn) {
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
            BaseNestedModel.prototype.eachComponentValue = function (value, fn) {
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
            BaseNestedModel.prototype.setValue = function (value) {
                var changed = false;
                this.eachComponentValue(value, function (comp, val) {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            };
            return BaseNestedModel;
        }((0, Model_1.Model)(props)(BaseClass)));
    };
}
exports.NestedModel = NestedModel;
;