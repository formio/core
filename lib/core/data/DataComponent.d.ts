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
export declare class DataComponent extends NestedComponent {
    get defaultValue(): {};
    /**
     * Get the component data.
     */
    componentData(): any;
    /**
     * The empty value for this component.
     *
     * @return {null}
     */
    get emptyValue(): any;
    /**
     * Get the datavalue of this component.
     */
    get dataValue(): any;
    set dataValue(value: any);
}
