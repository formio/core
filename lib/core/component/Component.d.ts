/// <reference types="trusted-types" />
import EventEmitter from 'eventemitter3';
/**
 * The component JSON schema.
 */
export interface ComponentSchema {
    type: string;
    key: string;
    label?: string;
}
/**
 * Component options.
 */
export interface ComponentOptions {
    language?: string;
    i18n?: any;
    namespace?: string;
    hooks?: any;
    template?: string;
    noInit?: boolean;
}
/**
 * The base component for all rendered components within Form.io platform.
 */
export declare class Component extends EventEmitter {
    component: (ComponentSchema | any);
    options: ComponentOptions;
    data: any;
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    static schema(extend?: any): any;
    id: string;
    /**
     * The DOM Element associated with this component.
     */
    element?: HTMLElement;
    /**
     * Boolean to let us know if this component is attached to the DOM or not.
     */
    attached: boolean;
    /**
     * The DOM element references used for component logic.
     */
    refs: any;
    /**
     * The parent component.
     */
    parent?: Component;
    /**
     * The root component.
     */
    root?: Component;
    /**
     * The template to render for this component.
     */
    template: any;
    /**
     * An array of attached listeners.
     */
    attachedListeners: Array<any>;
    /**
     * @constructor
     * @param component
     * @param options
     * @param data
     */
    constructor(component?: (ComponentSchema | any), options?: ComponentOptions, data?: any);
    /**
     * Initializes the component.
     */
    init(): void;
    get defaultSchema(): any;
    /**
     * Interpolate a template string.
     * @param template - The template string to interpolate.
     * @param context - The context variables to pass to the interpolation.
     */
    interpolate(template: string, context: any): any;
    /**
     * The rendering context.
     * @param context - The existing contexts from parent classes.
     */
    renderContext(context?: any): any;
    /**
     * Renders this component as an HTML string.
     */
    render(context?: any): string;
    /**
     * Returns the template references.
     */
    getRefs(): {};
    /**
     * Loads the elemement references.
     * @param element
     */
    loadRefs(element: HTMLElement): void;
    /**
     * Renders the component and then attaches this component to the HTMLElement.
     * @param element
     */
    attach(element?: HTMLElement | undefined): Promise<this>;
    /**
     * Redraw this component.
     * @returns
     */
    redraw(): Promise<this | undefined>;
    /**
     * Sanitize an html string.
     *
     * @param string
     * @returns {*}
     */
    sanitize(dirty: string): (TrustedHTML | string);
    /**
     * Get all available translations.
     */
    get translations(): any;
    /**
     * Tranlation method to translate a string being rendered.
     * @param str
     */
    t(str: string): string;
    /**
     * The evaluation context for interpolations.
     * @param extend
     */
    evalContext(extend?: any): any;
    /**
     * Render a template with provided context.
     * @param name
     * @param ctx
     */
    protected renderTemplate(name: any, ctx?: any): string;
    /**
     * Allow for options to hook into the functionality of this renderer.
     * @return {*}
     */
    hook(name: string, ...args: any): any;
    /**
     * Returns the data value for this component.
     */
    get dataValue(): any;
    /**
     * Sets the datavalue for this component.
     */
    set dataValue(value: any);
    /**
     * Bubbles an event to the top.
     * @param event
     * @param args
     */
    bubble(event: string, ...args: any[]): void;
    /**
     * Determine if this component has changed values.
     *
     * @param value - The value to compare against the current value.
     */
    hasChanged(value: any): boolean;
    /**
     * Updates the data model value without setting the view.
     * @param value The value to update within this component.
     * @return boolean true if the value has changed.
     */
    updateValue(value: any): boolean;
    /**
     * Sets the data value and updates the view representation.
     * @param value
     */
    setValue(value: any): boolean;
    /**
     * Returns the main HTML Element for this component.
     */
    getElement(): (HTMLElement | undefined);
    /**
     * Remove all event handlers.
     */
    detach(): void;
    /**
     * Clear an element.
     */
    clear(): void;
    /**
     * Appends an element to this component.
     * @param element
     */
    append(element: (HTMLElement | undefined)): void;
    /**
     * Prepends an element to this component.
     * @param element
     */
    prepend(element: (HTMLElement | undefined)): void;
    /**
     * Removes an element from this component.
     * @param element
     */
    removeChild(element: (HTMLElement | undefined)): void;
    /**
     * Wrapper method to add an event listener to an HTML element.
     *
     * @param obj
     *   The DOM element to add the event to.
     * @param type
     *   The event name to add.
     * @param func
     *   The callback function to be executed when the listener is triggered.
     * @param persistent
     *   If this listener should persist beyond "destroy" commands.
     */
    addEventListener(obj: any, type: string, func: any): this | undefined;
    /**
     * Remove all the attached listeners.
     */
    removeAttachedListeners(): void;
    /**
     * Remove an event listener from the object.
     *
     * @param obj
     * @param type
     */
    removeEventListener(obj: any, type: string, func: any): this;
}
