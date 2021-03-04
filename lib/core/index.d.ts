/**
 * Manages all of the components within the Form.io renderer.
 */
export declare class Components {
    /**
     * An array of Components available to be rendered.
     */
    static components: any;
    /**
     * Create a new component.
     *
     * ```ts
     * const htmlComp = Components.createComponent({
     *    type: 'html',
     *    tag: 'p',
     *    content: 'This is a test.'
     * })
     * ```
     *
     * @param comp The component JSON you wish to create.
     * @param options The options to pass to this component.
     * @param data The data you wish to provide to this component.
     */
    static createComponent(comp: any, options?: any, data?: any): any;
    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    static addComponent(component: any): void;
    /**
     * Takes a component JSON definition, and then converts it into a Component class that can
     * be instantiated as well as created with ```createComponent```.
     *
     * For example, you can import an H3 component using the following code.
     *
     * ```ts
     * Components.importComponent({
     *    type: 'h3',
     *    extends: 'html',
     *    schema: {
     *      tag: 'h3'
     *    }
     * });
     * const h3 = Components.createComponent({
     *    type: 'h3',
     *    content: 'This is an H3 header!'
     * });
     * console.log(h3.render()); // Outputs "<h3>This is an H3 header!</h3>"
     * ```
     *
     * @param definition
     */
    static importComponent(definition: any): any;
}
import '../components';
