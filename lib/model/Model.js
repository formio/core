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
exports.Model = void 0;
var _ = __importStar(require("@formio/lodash"));
var EventEmitter_1 = require("./EventEmitter");
function Model(props) {
    if (props === void 0) { props = {}; }
    if (!props.schema) {
        props.schema = {};
    }
    if (!props.schema.key) {
        props.schema.key = '';
    }
    return function (BaseClass) {
        return /** @class */ (function (_super) {
            __extends(BaseModel, _super);
            /**
             * @constructor
             * @param component
             * @param options
             * @param data
             */
            function BaseModel(component, options, data) {
                if (component === void 0) { component = {}; }
                if (options === void 0) { options = {}; }
                if (data === void 0) { data = {}; }
                var _this = _super.call(this, component, options, data) || this;
                _this.component = component;
                _this.options = options;
                _this.data = data;
                /**
                 * The root entity.
                 */
                _this.root = null;
                /**
                 * The component validator instance.
                 * @returns
                 */
                _this.validator = null;
                _this.id = "e".concat(Math.random().toString(36).substring(7));
                _this.component = _.merge({}, _this.defaultSchema, _this.component);
                _this.options = __assign(__assign({}, _this.defaultOptions), _this.options);
                if (!_this.options.noInit) {
                    _this.init();
                }
                return _this;
            }
            /**
             * The validator for this component.
             * @returns
             */
            /**
             * The default JSON schema
             * @param extend
             */
            BaseModel.schema = function () {
                return props.schema;
            };
            Object.defineProperty(BaseModel.prototype, "defaultOptions", {
                get: function () {
                    return {};
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseModel.prototype, "defaultSchema", {
                get: function () {
                    return BaseModel.schema();
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Initializes the entity.
             */
            BaseModel.prototype.init = function () {
                this.hook('init');
                if (this.options.validator) {
                    this.validator = this.options.validator.fromComponent(this);
                }
            };
            /**
             * Check the validity of this specific component.
             *
             * @returns
             */
            BaseModel.prototype.checkComponentValidity = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.validator ? this.validator.check() : true];
                    });
                });
            };
            /**
             * Checks the validity of this component and all child components.
             * @returns
             */
            BaseModel.prototype.checkValidity = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, this.checkComponentValidity()];
                    });
                });
            };
            Object.defineProperty(BaseModel.prototype, "errors", {
                /**
                 * Return the errors from validation for this component.
                 */
                get: function () {
                    return this.validator.errors;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseModel.prototype, "emptyValue", {
                /**
                 * The empty value for this component.
                 *
                 * @return {null}
                 */
                get: function () {
                    return null;
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Checks to see if this components value is empty.
             *
             * @param value
             * @returns
             */
            BaseModel.prototype.isEmpty = function (value) {
                if (value === void 0) { value = this.dataValue; }
                var isEmptyArray = (_.isArray(value) && value.length === 1) ? _.isEqual(value[0], this.emptyValue) : false;
                return value == null || value.length === 0 || _.isEqual(value, this.emptyValue) || isEmptyArray;
            };
            Object.defineProperty(BaseModel.prototype, "dataValue", {
                /**
                 * Returns the data value for this component.
                 */
                get: function () {
                    return _.get(this.data, this.component.key);
                },
                /**
                 * Sets the datavalue for this component.
                 */
                set: function (value) {
                    if (this.component.key) {
                        _.set(this.data, this.component.key, value);
                    }
                },
                enumerable: false,
                configurable: true
            });
            /**
             * Determine if this component has changed values.
             *
             * @param value - The value to compare against the current value.
             */
            BaseModel.prototype.hasChanged = function (value) {
                return String(value) !== String(this.dataValue);
            };
            /**
             * Updates the data model value
             * @param value The value to update within this component.
             * @return boolean true if the value has changed.
             */
            BaseModel.prototype.updateValue = function (value) {
                var changed = this.hasChanged(value);
                this.dataValue = value;
                if (changed) {
                    // Bubble a change event.
                    this.bubble('change', value);
                }
                return changed;
            };
            /**
             * Get the model value.
             * @returns
             */
            BaseModel.prototype.getValue = function () {
                return this.dataValue;
            };
            /**
             * Allow for options to hook into the functionality of this entity.
             * @return {*}
             */
            BaseModel.prototype.hook = function (name) {
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
            return BaseModel;
        }((0, EventEmitter_1.EventEmitter)(BaseClass)));
    };
}
exports.Model = Model;
