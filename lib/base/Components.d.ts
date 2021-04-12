/**
 * Manages all of the components within the Form.io renderer.
 */
export declare class Components {
    /**
     * An array of Components available to be rendered.
     */
    static components: any;
    static decorators: any;
    /**
     * Gets a specific component type.
     *
     * @param type
     * @param from
     * @returns
     */
    static component(type: string, from?: any): any;
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
    static create(comp: any, options?: any, data?: any): any;
    /**
     * Adds a base decorator type component.
     *
     * @param baseComponent
     * @param type
     */
    static addDecorator(decorator: any, type: string): void;
    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    static addComponent(component: any, type: string): any;
    /**
     * Imports a new component based on the JSON decorator of that component.
     * @param component
     */
    static importComponent(props?: any): void;
    /**
     * Sets the components used within this renderer.
     * @param components
     */
    static setComponents(components: any): void;
}
/**
 * Render a component attached to an html component.
 *
 * @param element
 * @param component
 * @param options
 * @param data
 */
export declare function render(element: HTMLElement, component: any, options?: any, data?: any): any;
