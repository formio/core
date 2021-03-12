import { Component, ComponentSchema, ComponentOptions } from '../component/Component';
export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}
/**
 * Provides a nested component structure, where components can be nested within other components.
 */
export declare class NestedComponent extends Component {
    components: Array<Component>;
    template: any;
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    static schema(extend?: any): NestedComponent;
    constructor(component?: (NestedComponentSchema | any), options?: ComponentOptions, data?: any);
    /**
     * Initialize the nested component as well as create all nested components.
     */
    init(): void;
    /**
     * Return the default schema for this component.
     */
    get defaultSchema(): NestedComponent;
    getComponents(): Array<Component>;
    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} fn - Called for each component
     */
    eachComponent(fn: Function): void;
    /**
     * Attach a html element to this nestd component.
     * @param element
     */
    attach(element: HTMLElement): Promise<this>;
    /**
     * Detach components.
     */
    detach(): void;
    componentData(): any;
    removeComponent(component: Component): void;
    createComponent(component: ComponentSchema, data: any): Component;
    createComponents(data: any): Array<Component>;
    initComponents(): void;
    renderComponents(): string;
    /**
     * Get the datavalue of this component.
     */
    get dataValue(): any;
    /**
     * Iterate through each component value.
     *
     * @param value The context data value.
     * @param fn Callback to be called with the component and the value for that component.
     */
    eachComponentValue(value: any, fn: any): void;
    /**
     * Sets the datavalue for this component.
     */
    set dataValue(value: any);
    /**
     * Sets the value for a data component.
     *
     * @param value
     */
    setValue(value: any): boolean;
}
