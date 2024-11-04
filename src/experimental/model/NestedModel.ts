import { each, get } from 'lodash';
import { Model, ModelInterface, ModelDecoratorInterface } from './Model';
export function NestedModel(props: any = {}): ModelDecoratorInterface {
  if (!props.schema) {
    props.schema = {};
  }
  if (!props.schema.components) {
    props.schema.components = [];
  }
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class BaseNestedModel extends Model(props)(BaseClass) {
      public components!: Array<any>;

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
      createComponent(component: any, options: any, data: any) {
        if (!props.factory) {
          console.log('Cannot create components. No "factory" provided.');
          return null;
        }
        const comp = props.factory.create(
          component,
          {
            noInit: true,
            ...options,
          },
          data,
        );
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
      createComponents(data: any, eachComp?: any): Array<any> {
        const added: Array<any> = [];
        (this.component.components || []).forEach((comp: any) => {
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
      removeComponent(component: any) {
        (this.components || []).forEach((comp: any, index: number) => {
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
      public async checkValidity() {
        return this.components.reduce((valid: boolean, comp: any) => {
          return valid && comp.checkValidity();
        }, this.checkComponentValidity());
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
      get emptyValue(): any {
        return {};
      }

      /**
       * Get the datavalue of this component.
       */
      public get dataValue() {
        return this.data;
      }

      /**
       * Perform an iteration over each component within this container component.
       *
       * @param {function} fn - Called for each component
       */
      eachComponent(fn: Function) {
        each(this.components, (component: any, index: any) => {
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
      public eachComponentValue(value: any, fn: any) {
        if (Object.keys(value).length) {
          this.eachComponent((comp: any) => {
            fn(comp, get(value, comp.component.key));
          });
        }
      }

      /**
       * Set the data value for this nested entity.
       */
      public set dataValue(value: any) {
        this.eachComponentValue(value, (comp: any, val: any) => (comp.dataValue = val));
      }

      /**
       * Sets the value for a data component.
       *
       * @param value
       */
      public setValue(value: any): boolean {
        let changed = false;
        this.eachComponentValue(value, (comp: any, val: any) => {
          changed = comp.setValue(val) || changed;
        });
        return changed;
      }
    };
  };
}
