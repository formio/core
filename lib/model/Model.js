"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var _ = __importStar(require("@formio/lodash"));
var eventemitter3_1 = __importDefault(require("eventemitter3"));
function Model(props) {
    if (props === void 0) { props = {}; }
    if (!props.schema) {
        props.schema = {};
    }
    if (!props.schema.key) {
        props.schema.key = '';
    }
    return /** @class */ (function () {
        /**
         * @constructor
         * @param component
         * @param options
         * @param data
         */
        function Model(component, options, data) {
            if (component === void 0) { component = {}; }
            if (options === void 0) { options = {}; }
            if (data === void 0) { data = {}; }
            this.component = component;
            this.options = options;
            this.data = data;
            /**
             * The parent entity.
             */
            this.parent = null;
            /**
             * The root entity.
             */
            this.root = null;
            /**
             * The events to fire for this model.
             */
            this.events = new eventemitter3_1.default();
            this.id = "e" + Math.random().toString(36).substring(7);
            this.component = _.merge({}, this.defaultSchema, this.component);
            this.options = __assign(__assign({}, this.defaultOptions), this.options);
            if (!this.options.noInit) {
                this.init();
            }
        }
        /**
         * The default JSON schema
         * @param extend
         */
        Model.schema = function () {
            return props.schema;
        };
        Object.defineProperty(Model.prototype, "defaultOptions", {
            get: function () {
                return {};
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "defaultSchema", {
            get: function () {
                return Model.schema();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Initializes the entity.
         */
        Model.prototype.init = function () {
            this.hook('init');
        };
        Object.defineProperty(Model.prototype, "emptyValue", {
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
        Model.prototype.isEmpty = function (value) {
            if (value === void 0) { value = this.dataValue; }
            var isEmptyArray = (_.isArray(value) && value.length === 1) ? _.isEqual(value[0], this.emptyValue) : false;
            return value == null || value.length === 0 || _.isEqual(value, this.emptyValue) || isEmptyArray;
        };
        Object.defineProperty(Model.prototype, "dataValue", {
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
        Model.prototype.hasChanged = function (value) {
            return String(value) !== String(this.dataValue);
        };
        /**
         * Updates the data model value
         * @param value The value to update within this component.
         * @return boolean true if the value has changed.
         */
        Model.prototype.updateValue = function (value) {
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
        Model.prototype.getValue = function () {
            return this.dataValue;
        };
        /**
         * Allow for options to hook into the functionality of this entity.
         * @return {*}
         */
        Model.prototype.hook = function (name) {
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
        Model.prototype.bubble = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.parent) {
                return (_a = this.parent).bubble.apply(_a, __spreadArray([event], args));
            }
            return this.emit.apply(this, __spreadArray([event], args));
        };
        Model.prototype.emit = function (event) {
            var _a, _b;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.parent) {
                // Bubble emit events up to the parent.
                return (_a = this.parent).emit.apply(_a, __spreadArray([event], args));
            }
            return (_b = this.events).emit.apply(_b, __spreadArray([event], args));
        };
        Model.prototype.on = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).on.apply(_a, __spreadArray([event, fn], args));
        };
        Model.prototype.once = function (event, fn) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return (_a = this.events).once.apply(_a, __spreadArray([event, fn], args));
        };
        Model.prototype.off = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.events).off.apply(_a, __spreadArray([event], args));
        };
        return Model;
    }());
}
exports.Model = Model;
