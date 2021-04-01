import * as _ from '@formio/lodash';
import { Constructor } from '../core/Constructor';
import { Model } from './Model';
export function NestedModel<TBase extends Constructor>(Base: TBase, Factory: any) {
    const modelValue = Object.getOwnPropertyDescriptor(Model(Base), 'dataValue');
    return class NestedModel extends Model(Base) {
        public children: Array<any> = [];

        /**
         * Initialize the nested entity by creating the children.
         */
        init() {
            super.init();
            this.createChildren(this.childData());
        }

        /**
         * Get the child data.
         * @returns
         */
        childData() {
            return this.data;
        }

        /**
         * Creates a new child entity.
         * @param child
         * @param options
         * @param data
         * @returns
         */
        createChild(child: any, options: any, data: any) {
            const comp = Factory.create(child, {
                noInit: true,
                ...options
            }, data);
            comp.parent = this;
            comp.root = this.root || this;
            comp.init();
            return comp;
        }

        /**
         * Creates children.
         * @param data
         * @returns
         */
        createChildren(data: any): Array<any> {
            const added: Array<any> = [];
            (this.component.components || []).forEach((comp: any) => {
                const newComp = this.createChild(comp, this.options, data);
                this.children?.push(newComp);
                added.push(newComp);
            });
            return added;
        }

        /**
         * Removes a child entity.
         * @param component
         */
        removeChild(component: any) {
            (this.children || []).forEach((comp: any, index: number) => {
                if (comp === component) {
                    if (comp.detach) {
                        comp.detach();
                    }
                    this.children?.splice(index, 1);
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
            return modelValue?.get?.call(this);
        }

        /**
         * Perform an iteration over each component within this container component.
         *
         * @param {function} fn - Called for each component
         */
        eachChild(fn: Function) {
            _.each(this.children, (component: any, index: any) => {
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
        public eachEntityValue(value: any, fn: any) {
            if (Object.keys(value).length) {
                this.eachChild((child: any) => {
                    fn(child, _.get(value, child.component.key));
                });
            }
        }

        /**
         * Set the data value for this nested entity.
         */
        public set dataValue(value: any) {
            this.eachEntityValue(value, (child: any, val: any) => (child.dataValue = val));
        }

        /**
         * Sets the value for a data component.
         *
         * @param value
         */
        public setValue(value: any): boolean {
            var changed = false;
            this.eachEntityValue(value, (comp: any, val: any) => {
                changed = comp.setValue(val) || changed;
            });
            return changed;
        }
    }
}