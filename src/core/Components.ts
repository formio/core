/**
 * Manages all of the components within the Form.io renderer.
 */
export class Components {
    /**
     * An array of Components available to be rendered.
     */
    public static components: any = {};
    public static baseComponents: any = {};

    /**
     * Gets a specific component type.
     *
     * @param type
     * @param from
     * @returns
     */
    public static component(type: string, from: any = 'components') {
        if ((Components as any)[from][type]) {
            return (Components as any)[from][type];
        }
        else {
            return (Components as any)[from].component;
        }
    }

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
    public static create(comp: any, options?: any, data?: any) {
        return new (Components.component(comp.type))(comp, options, data);
    }

    /**
     * Adds a base decorator type component.
     *
     * @param baseComponent
     * @param type
     */
    public static addBaseComponent(baseComponent: any, type: string) {
        Components.baseComponents[type] = baseComponent;
    }

    /**
     * Adds a new component to the renderer. Can either be a component class or a component JSON
     * to be imported.
     *
     * @param component
     */
    public static addComponent(component: any) {
        if (!component) {
            return;
        }
        if (typeof component !== 'function') {
            return Components.importComponent(component);
        }
        Components.components[component.schema().type] = component;
        return component;
    }

    /**
     * Imports a new component based on the JSON decorator of that component.
     * @param component
     */
    public static importComponent(component: any) {
        const BaseComp = Components.component(component.extends, 'baseComponents');
        class ExtendedComponent extends BaseComp(component) {}
        Components.addComponent(ExtendedComponent);
    }

    /**
     * Render a component attached to an html component.
     *
     * @param element
     * @param component
     * @param options
     * @param data
     */
    public static render(
        element: HTMLElement,
        component: any,
        options: any = {},
        data: any = {}
    ) {
        return Components.create(component, options, data).attach(element);
    }
}