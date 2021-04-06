import { Components } from '../Components';
import { ComponentWithModel, ComponentInterface } from '../component/Component';
import { NestedComponentWithModel } from '../nested/NestedComponent';
import { NestedArrayModel } from '../../model/NestedArrayModel';
import * as _ from '@formio/lodash';
export const NestedArrayComponent = NestedComponentWithModel(ComponentWithModel(NestedArrayModel(Components)));
/**
 * An array data type component. This provides a nested component that creates "rows" of data
 * where each row creates new instances of the JSON components and sets the data context for
 * each row according to the row it is within.
 *
 * For example, if you have the following JSON schema.
 *
 * ```
 * {
 *   type: 'array',
 *   key: 'customers',
 *   components: [
 *     {
 *        type: 'datavalue',
 *        key: 'firstName'
 *     },
 *     {
 *        type: 'datavalue',
 *        key: 'lastName'
 *     }
 *   ]
 * }
 * ```
 *
 * You can now create multiple rows using the following data.
 *
 * ```
 * {
 *    customers: [
 *      {firstName: 'Joe', lastName: 'Smith'},
 *      {firstName: 'Sally', lastName: 'Thompson'},
 *      {firstName: 'Sue', lastName: 'Warner'}
 *    ]
 * }
 * ```
 */
export function ArrayComponent(...props: any): ComponentInterface {
    props.unshift({type: 'array'});
    return class ExtendedArrayComponent extends NestedArrayComponent(...props) {}
}

Components.addBaseComponent(ArrayComponent, 'array');
Components.addComponent(ArrayComponent());