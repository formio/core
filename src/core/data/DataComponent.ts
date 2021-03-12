import { Component, ComponentOptions } from '../component/Component';
import { NestedComponent, NestedComponentSchema } from '../nested/NestedComponent';
import * as _ from '../../util/lodash';
const compDataValue: any = Object.getOwnPropertyDescriptor(Component.prototype, 'dataValue');
const nestedDataValue: any = Object.getOwnPropertyDescriptor(NestedComponent.prototype, 'dataValue');

/**
 * A DataComponent is one that establishes a new data context for all of its
 * children at the specified "key" of this comopnent. For example, if this data
 * component has a key of "employee", and then some components within the data
 * component of "firstName" and "lastName", the data structure provided by this
 * component would resemble the following.
 *
 * {
 *   "employee": {
 *      "firstName": "Bob",
 *      "lastName": "Smith"
 *   }
 * }
 */
export class DataComponent extends NestedComponent {
    get defaultValue() {
        return {};
    }

    /**
     * Get the component data.
     */
    componentData() {
        const compData: any = _.get(this.data, this.component.key, this.defaultValue);
        if (!Object.keys(compData).length) {
            _.set(this.data, this.component.key, compData);
        }
        return compData;
    }

    /**
     * Get the datavalue of this component.
     */
    public get dataValue() {
        return compDataValue.get.call(this);
    }

    public set dataValue(value: any) {
        nestedDataValue.set.call(this, value);
    }
}