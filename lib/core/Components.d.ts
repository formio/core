/**
 * Manages all of the components within the Form.io renderer.
 */
export declare class Components {
    /**
     * An array of Components available to be rendered.
     */
    static components: any;
    static component(type: string): any;
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
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    static addComponent(component: any, type?: string): any;
    static importComponent(component: any): void;
    /**
     * Render a component attached to an html component.
     *
     * @param element
     * @param component
     * @param options
     * @param data
     */
    static render(element: HTMLElement, component: any, options?: any, data?: any): any;
}
