import { ModelDecoratorInterface } from '@formio/model';
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
export declare function DataComponent(props?: any): ModelDecoratorInterface;
