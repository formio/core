import * as _ from '@formio/lodash';
import { Model } from './Model';
export function NestedModel(Factory: any) {
    return function(props: any = {}) {
        if (!props.schema) {
            props.schema = {};
        }
        if (!props.schema.components) {
            props.schema.components = [];
        }
        return class NestedModel extends Model(props) {
            public components!: Array<any>;

            /**
             * Initialize the nested entity by creating the children.
             */
            init() {
                this.components = [];
                super.init();
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
                const comp = Factory.create(component, {
                    noInit: true,
                    ...options
                }, data);
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
            createComponents(data: any): Array<any> {
                const added: Array<any> = [];
                (this.component.components || []).forEach((comp: any) => {
                    const newComp = this.createComponent(comp, this.options, data);
                    this.components?.push(newComp);
                    added.push(newComp);
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
                        this.components?.splice(index, 1);
                    }
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
                _.each(this.components, (component: any, index: any) => {
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
                        fn(comp, _.get(value, comp.component.key));
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
                var changed = false;
                this.eachComponentValue(value, (comp: any, val: any) => {
                    changed = comp.setValue(val) || changed;
                });
                return changed;
            }
        }
    };
}