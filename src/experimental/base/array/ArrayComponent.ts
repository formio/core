import { Components } from '../Components';
import { NestedArrayModel, ModelDecoratorInterface, ModelInterface } from '../../model';
import { NestedComponent } from '../nested/NestedComponent';
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
export function ArrayComponent(props: any = {}): ModelDecoratorInterface {
  if (!props.type) {
    props.type = 'array';
  }
  if (!props.model) {
    props.model = NestedArrayModel;
  }
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class ExtendedArrayComponent extends NestedComponent(props)(BaseClass) {};
  };
}

Components.addDecorator(ArrayComponent, 'array');
Components.addComponent(ArrayComponent()(), 'array');
