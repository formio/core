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
exports.Model = void 0;
const _ = __importStar(require("@formio/lodash"));
const EventEmitter_1 = require("./EventEmitter");
function Model(props = {}) {
    if (!props.schema) {
        props.schema = {};
    }
    if (!props.schema.key) {
        props.schema.key = '';
    }
    return function (BaseClass) {
        return class BaseModel extends (0, EventEmitter_1.EventEmitter)(BaseClass) {
            /**
             * The validator for this component.
             * @returns
             */
            /**
             * The default JSON schema
             * @param extend
             */
            static schema() {
                return props.schema;
            }
            /**
             * @constructor
             * @param component
             * @param options
             * @param data
             */
            constructor(component = {}, options = {}, data = {}) {
                super(component, options, data);
                this.component = component;
                this.options = options;
                this.data = data;
                /**
                 * The root entity.
                 */
                this.root = null;
                /**
                 * The component validator instance.
                 * @returns
                 */
                this.validator = null;
                this.id = `e${Math.random().toString(36).substring(7)}`;
                this.component = _.merge({}, this.defaultSchema, this.component);
                this.options = Object.assign(Object.assign({}, this.defaultOptions), this.options);
                if (!this.options.noInit) {
                    this.init();
                }
            }
            get defaultOptions() {
                return {};
            }
            get defaultSchema() {
                return BaseModel.schema();
            }
            /**
             * Initializes the entity.
             */
            init() {
                this.hook('init');
                if (this.options.validator) {
                    this.validator = this.options.validator.fromComponent(this);
                }
            }
            /**
             * Check the validity of this specific component.
             *
             * @returns
             */
            checkComponentValidity() {
                return __awaiter(this, void 0, void 0, function* () {
                    return this.validator ? this.validator.check() : true;
                });
            }
            /**
             * Checks the validity of this component and all child components.
             * @returns
             */
            checkValidity() {
                return __awaiter(this, void 0, void 0, function* () {
                    return this.checkComponentValidity();
                });
            }
            /**
             * Return the errors from validation for this component.
             */
            get errors() {
                return this.validator.errors;
            }
            /**
             * The empty value for this component.
             *
             * @return {null}
             */
            get emptyValue() {
                return null;
            }
            /**
             * Checks to see if this components value is empty.
             *
             * @param value
             * @returns
             */
            isEmpty(value = this.dataValue) {
                const isEmptyArray = (_.isArray(value) && value.length === 1) ? _.isEqual(value[0], this.emptyValue) : false;
                return value == null || value.length === 0 || _.isEqual(value, this.emptyValue) || isEmptyArray;
            }
            /**
             * Returns the data value for this component.
             */
            get dataValue() {
                return _.get(this.data, this.component.key);
            }
            /**
             * Sets the datavalue for this component.
             */
            set dataValue(value) {
                if (this.component.key) {
                    _.set(this.data, this.component.key, value);
                }
            }
            /**
             * Determine if this component has changed values.
             *
             * @param value - The value to compare against the current value.
             */
            hasChanged(value) {
                return String(value) !== String(this.dataValue);
            }
            /**
             * Updates the data model value
             * @param value The value to update within this component.
             * @return boolean true if the value has changed.
             */
            updateValue(value) {
                const changed = this.hasChanged(value);
                this.dataValue = value;
                if (changed) {
                    // Bubble a change event.
                    this.bubble('change', value);
                }
                return changed;
            }
            /**
             * Get the model value.
             * @returns
             */
            getValue() {
                return this.dataValue;
            }
            /**
             * Allow for options to hook into the functionality of this entity.
             * @return {*}
             */
            hook(name, ...args) {
                if (this.options &&
                    this.options.hooks &&
                    this.options.hooks[name]) {
                    return this.options.hooks[name].apply(this, args);
                }
                else {
                    // If this is an async hook instead of a sync.
                    const fn = (typeof args[args.length - 1] === 'function') ? args[args.length - 1] : null;
                    if (fn) {
                        return fn(null, args[1]);
                    }
                    else {
                        return args[1];
                    }
                }
            }
        };
    };
}
exports.Model = Model;
