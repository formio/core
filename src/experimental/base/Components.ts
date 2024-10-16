/**
 * Manages all of the components within the Form.io renderer.
 */
export class Components {
  /**
   * An array of Components available to be rendered.
   */
  public static components: any = {};
  public static decorators: any = {};

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
    } else {
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
  public static addDecorator(decorator: any, type: string) {
    Components.decorators[type] = decorator;
  }

  /**
   * Adds a new component to the renderer. Can either be a component class or a component JSON
   * to be imported.
   *
   * @param component
   */
  public static addComponent(component: any, type: string) {
    if (!component) {
      return;
    }
    if (typeof component !== 'function') {
      return Components.importComponent(component);
    }
    Components.components[type] = component;
    return component;
  }

  /**
   * Imports a new component based on the JSON decorator of that component.
   * @param component
   */
  public static importComponent(props: any = {}) {
    const Decorator = Components.component(props.extends, 'decorators');
    @Decorator(props)
    class ExtendedComponent {}
    Components.addComponent(ExtendedComponent, props.type);
  }

  /**
   * Sets the components used within this renderer.
   * @param components
   */
  public static setComponents(components: any) {
    Object.assign(Components.components, components);
  }
}

/**
 * Render a component attached to an html component.
 *
 * @param element
 * @param component
 * @param options
 * @param data
 */
export function render(element: HTMLElement, component: any, options: any = {}, data: any = {}) {
  return Components.create(component, options, data).attach(element);
}
