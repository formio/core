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
exports.NestedModel = void 0;
const _ = __importStar(require("@formio/lodash"));
const Model_1 = require("./Model");
function NestedModel(props = {}) {
    if (!props.schema) {
        props.schema = {};
    }
    if (!props.schema.components) {
        props.schema.components = [];
    }
    return function (BaseClass) {
        return class BaseNestedModel extends (0, Model_1.Model)(props)(BaseClass) {
            /**
             * Initialize the nested entity by creating the children.
             */
            init() {
                super.init();
                this.components = [];
                this.createComponents(this.componentData());
            }
            /**
             * Get the component data.
             * @returns
             */
            componentData() {
                return this.data;
            }
            /**
             * Creates a new component entity.
             * @param component
             * @param options
             * @param data
             * @returns
             */
            createComponent(component, options, data) {
                if (!props.factory) {
                    console.log('Cannot create components. No "factory" provided.');
                    return null;
                }
                const comp = props.factory.create(component, Object.assign({ noInit: true }, options), data);
                comp.parent = this;
                comp.root = this.root || this;
                comp.init();
                return comp;
            }
            /**
             * Creates the components.
             * @param data
             * @returns
             */
            createComponents(data, eachComp) {
                const added = [];
                (this.component.components || []).forEach((comp) => {
                    const newComp = this.createComponent(comp, this.options, data);
                    if (newComp) {
                        this.components.push(newComp);
                        added.push(newComp);
                        if (eachComp) {
                            eachComp(newComp);
                        }
                    }
                });
                return added;
            }
            /**
             * Removes a child comopnent.
             * @param component
             */
            removeComponent(component) {
                (this.components || []).forEach((comp, index) => {
                    if (comp === component) {
                        if (comp.detach) {
                            comp.detach();
                        }
                        this.components.splice(index, 1);
                    }
                });
            }
            /**
             * Checks for the validity of this component and all components within this component.
             * @returns
             */
            checkValidity() {
                return __awaiter(this, void 0, void 0, function* () {
                    return this.components.reduce((valid, comp) => {
                        return valid && comp.checkValidity();
                    }, this.checkComponentValidity());
                });
            }
            /**
             * Get the default value for this nested entity.
             */
            get defaultValue() {
                return {};
            }
            /**
             * The empty value for this component.
             *
             * @return {null}
             */
            get emptyValue() {
                return {};
            }
            /**
             * Get the datavalue of this component.
             */
            get dataValue() {
                return this.data;
            }
            /**
             * Perform an iteration over each component within this container component.
             *
             * @param {function} fn - Called for each component
             */
            eachComponent(fn) {
                _.each(this.components, (component, index) => {
                    if (fn(component, index) === false) {
                        return false;
                    }
                });
            }
            /**
             * Iterate through each component value.
             *
             * @param value The context data value.
             * @param fn Callback to be called with the component and the value for that component.
             */
            eachComponentValue(value, fn) {
                if (Object.keys(value).length) {
                    this.eachComponent((comp) => {
                        fn(comp, _.get(value, comp.component.key));
                    });
                }
            }
            /**
             * Set the data value for this nested entity.
             */
            set dataValue(value) {
                this.eachComponentValue(value, (comp, val) => (comp.dataValue = val));
            }
            /**
             * Sets the value for a data component.
             *
             * @param value
             */
            setValue(value) {
                var changed = false;
                this.eachComponentValue(value, (comp, val) => {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            }
        };
    };
}
exports.NestedModel = NestedModel;
;
