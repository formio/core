import { Components } from '../Components';
import { NestedDataModel, ModelDecoratorInterface, ModelInterface } from '../../model';
import { NestedComponent } from '../nested/NestedComponent';

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
export function DataComponent(props: any = {}): ModelDecoratorInterface {
  if (!props.type) {
    props.type = 'data';
  }
  if (!props.model) {
    props.model = NestedDataModel;
  }
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class ExtendedDataComponent extends NestedComponent(props)(BaseClass) {};
  };
}

Components.addDecorator(DataComponent, 'data');
Components.addComponent(DataComponent()(), 'data');
