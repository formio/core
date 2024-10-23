import { merge, isArray, isEqual, get, set } from 'lodash';
import { EventEmitter, ModelInterface } from './EventEmitter';
export { ModelInterface };

export interface ModelDecoratorInterface {
  (BaseClass?: ModelInterface): ModelInterface;
}

export function Model(props: any = {}): ModelDecoratorInterface {
  if (!props.schema) {
    props.schema = {};
  }
  if (!props.schema.key) {
    props.schema.key = '';
  }
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class BaseModel extends EventEmitter(BaseClass) {
      /**
       * A random generated ID for this entity.
       */
      public id!: string;

      /**
       * The root entity.
       */
      public root: any = null;

      /**
       * The default JSON schema
       * @param extend
       */
      public static schema(): any {
        return props.schema;
      }

      /**
       * @constructor
       * @param component
       * @param options
       * @param data
       */
      constructor(
        public component: any = {},
        public options: any = {},
        public data: any = {},
      ) {
        super(component, options, data);
        this.id = `e${Math.random().toString(36).substring(7)}`;
        this.component = merge({}, this.defaultSchema, this.component) as any;
        this.options = { ...this.defaultOptions, ...this.options };
        if (!this.options.noInit) {
          this.init();
        }
      }

      public get defaultOptions(): any {
        return {};
      }

      public get defaultSchema(): any {
        return BaseModel.schema();
      }

      /**
       * Initializes the entity.
       */
      public init() {
        this.hook('init');
      }

      /**
       * Return the errors from validation for this component.
       */
      public get errors() {
        return this.validator.errors;
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
        const isEmptyArray =
          isArray(value) && value.length === 1 ? isEqual(value[0], this.emptyValue) : false;
        return (
          value == null || value.length === 0 || isEqual(value, this.emptyValue) || isEmptyArray
        );
      }

      /**
       * Returns the data value for this component.
       */
      public get dataValue(): any {
        return this.component.key ? get(this.data, this.component.key) : this.data;
      }

      /**
       * Sets the datavalue for this component.
       */
      public set dataValue(value: any) {
        if (this.component.key) {
          set(this.data, this.component.key, value);
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
          // Bubble a change event.
          this.bubble('change', value);
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
        if (this.options && this.options.hooks && this.options.hooks[name]) {
          return this.options.hooks[name].apply(this, args);
        } else {
          // If this is an async hook instead of a sync.
          const fn = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null;
          if (fn) {
            return fn(null, args[1]);
          } else {
            return args[1];
          }
        }
      }
    };
  };
}
