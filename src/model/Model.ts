import * as _ from '@formio/lodash';
import { Constructor } from '../core/Constructor';
import { EventEmitter } from '../core/EventEmitter';
export function Model<TBase extends Constructor>(Base: TBase) {
    return class Model extends EventEmitter(Base) {
        /**
         * A random generated ID for this entity.
         */
        public id: string;

        /**
         * The parent entity.
         */
        public parent: any = null;

        /**
         * The root entity.
         */
        public root: any = null;

        /**
         * The JSON schema for a base entity.
         * @param extend
         */
        public static schema(extend: any = {}): any {
            return _.merge({
                key: ''
            }, extend);
        }

        /**
         * @constructor
         * @param component
         * @param options
         * @param data
         */
        constructor(public component: any, public options: any = {}, public data: any = {}) {
            super();
            this.id = `e${Math.random().toString(36).substring(7)}`;
            this.component = _.merge(this.defaultSchema, this.component) as any;
            this.options = Object.assign(this.defaultOptions, this.options);
            if (!this.options.noInit) {
                this.init();
            }
        }

        public get defaultOptions(): any {
            return {};
        }

        public get defaultSchema(): any {
            return Model.schema();
        }

        /**
         * Initializes the entity.
         */
        public init() {
            this.hook('init');
        }

        /**
         * The empty value for this component.
         *
         * @return {null}
         */
        get emptyValue(): any {
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
        public get dataValue(): any {
            return _.get(this.data, this.component.key);
        }

        /**
         * Sets the datavalue for this component.
         */
        public set dataValue(value: any) {
            if (this.component.key) {
                _.set(this.data, this.component.key, value);
            }
        }

        /**
         * Determine if this component has changed values.
         *
         * @param value - The value to compare against the current value.
         */
        public hasChanged(value: any) {
            return String(value) !== String(this.dataValue);
        }

        /**
         * Updates the data model value
         * @param value The value to update within this component.
         * @return boolean true if the value has changed.
         */
        public updateValue(value: any): boolean {
            const changed = this.hasChanged(value);
            this.dataValue = value;
            if (changed) {
                this.emit('change', value);
            }
            return changed;
        }

        /**
         * Get the model value.
         * @returns
         */
        public getValue(): any {
            return this.dataValue;
        }

        /**
         * Allow for options to hook into the functionality of this entity.
         * @return {*}
         */
        hook(name: string, ...args: any) {
            if (
                this.options &&
                this.options.hooks &&
                this.options.hooks[name]
            ) {
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
}