import { Components } from '../Components';
import { ComponentWithModel, ComponentInterface } from '../component/Component';
import { NestedComponentWithModel } from '../nested/NestedComponent';
import { NestedDataModel } from '../../model/NestedDataModel';
import * as _ from '@formio/lodash';
export const NestedDataComponent = NestedComponentWithModel(ComponentWithModel(NestedDataModel(Components)));

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
export function DataComponent(...props: any) : ComponentInterface {
    props.unshift({type: 'data'});
    return class ExtendedDataComponent extends NestedDataComponent(...props) {};
}

Components.addComponent(DataComponent, 'data');