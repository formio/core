import { Template } from '../../templates/Template';
import templates from '../../templates';
import { Evaluator, sanitize, dom, util } from '../../util';
import EventEmitter from 'eventemitter3';

/**
 * The component JSON schema.
 */
export interface ComponentSchema {
    type: string,
    key: string,
    label?: string
}

/**
 * Component options.
 */
export interface ComponentOptions {
    language?: string,
    i18n?: any,
    namespace?: string,
    hooks?: any,
    template?: string,
    tpl?: Template
}

/**
 * The base component for all rendered components within Form.io platform.
 */
export class Component extends EventEmitter {
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    static schema(extend: any = {}): any {
        return util.merge({
            type: 'component',
            key: 'component'
        }, extend);
    }

    /**
     * The DOM Element associated with this component.
     */
    public element?: HTMLElement;

    /**
     * Boolean to let us know if this component is attached to the DOM or not.
     */
    public attached: boolean = false;

    /**
     * The DOM element references used for component logic.
     */
    public refs?: any;

    /**
     * The parent component.
     */
    public parent?: Component;

    /**
     * The root component.
     */
    public root?: Component;

    /**
     * The template to render for this component.
     */
    public template: string = 'component';

    /**
     * @constructor
     * @param component
     * @param options
     * @param data
     */
    constructor(
        public component: (ComponentSchema | any),
        public options: ComponentOptions = {},
        public data: any = {}
    ) {
        super();
        this.component = util.merge(this.defaultSchema, this.component) as any;
        this.options = Object.assign({
            language: 'en',
            namespace: 'formio'
        }, this.options);
        this.init();
    }

    /**
     * Initializes the component.
     */
    public init() {
        this.hook('init');
        this.initTemplate();
    }

    public get defaultSchema(): any {
        return Component.schema();
    }

    /**
     * Initializes the template used for rendering this component.
     */
    public initTemplate() {
        // The template is already established.
        if (this.options.tpl) {
            return;
        }
        if (this.options.template && (templates as any)[this.options.template]) {
            this.options.tpl = new Template((templates as any)[this.options.template])
        }
        if (!this.options.tpl) {
            this.options.tpl = new Template(templates.bootstrap);
        }
    }

    /**
     * Interpolate a template string.
     * @param template - The template string to interpolate.
     * @param context - The context variables to pass to the interpolation.
     */
    public interpolate(template: string, context: any) {
        return Evaluator.interpolate(template, context);
    }

    /**
     * The rendering context.
     * @param context - The existing contexts from parent classes.
     */
    public renderContext(context: any = {}) {
        return this.evalContext(context);
    }

    /**
     * Renders this component as an HTML string.
     */
    public render(): string {
        return this.renderTemplate((this.template || this.component.type), this.renderContext());
    }

    /**
     * Loads the elemement references.
     * @param element
     * @param refs
     */
    loadRefs(element: HTMLElement, refs: any) {
        for (const ref in refs) {
            if (refs[ref] === 'single') {
                this.refs[ref] = element.querySelector(`[ref="${ref}"]`);
            }
            else {
                this.refs[ref] = element.querySelectorAll(`[ref="${ref}"]`);
            }
        }
    }

    /**
     * Renders the component and then attaches this component to the HTMLElement.
     * @param element
     */
    public async attach(element: HTMLElement) {
        this.element = element;
        if (element) {
            const parent = element.parentNode;
            if (parent) {
                const index = Array.prototype.indexOf.call(parent.children, element);
                element.outerHTML = String(this.sanitize(this.render()));
                element = parent.children[index] as HTMLElement;
                this.attached = true;
            }
        }
        return this;
    }

    /**
     * Sanitize an html string.
     *
     * @param string
     * @returns {*}
     */
    sanitize(dirty: string): (TrustedHTML | string) {
        return sanitize(dirty, this.options);
    }

    /**
     * Get all available translations.
     */
    public get translations(): any {
        if (
            this.options.language &&
            this.options.i18n &&
            this.options.i18n[this.options.language]
        ) {
            return this.options.i18n[this.options.language];
        }
        return {};
    }

    /**
     * Tranlation method to translate a string being rendered.
     * @param str
     */
    public t(str: string): string {
        if (this.translations[str]) {
            return this.translations[str];
        }
        return str;
    }

    /**
     * The evaluation context for interpolations.
     * @param extend
     */
    public evalContext(extend: any = {}) {
        return Object.assign({
            instance: this,
            component: this.component,
            options: this.options,
            data: this.data,
            value: () => this.dataValue,
            t: (str: string) => this.t(str)
        }, extend);
    }

    /**
     * Render a template with provided context.
     * @param name
     * @param ctx
     */
    protected renderTemplate(name: any, ctx: any = {}): string {
        if (!this.options.tpl) {
            return 'No template defined.';
        }
        return this.options.tpl.render(name, this.evalContext(ctx));
    }

    /**
     * Allow for options to hook into the functionality of this renderer.
     * @return {*}
     */
    hook(name: string, ...args: any) {
        if (
            this.options &&
            this.options.hooks &&
            this.options.hooks[name]
        ) {
            return this.options.hooks[name].apply(this, args);
        }
        else {
            // If this is an async hook instead of a sync.
            const fn = (typeof args[args.length - 1] === 'function') ? args[args.length - 1] : null;
            if (fn) {
                return fn(null, args[1]);
            }
            else {
                return args[1];
            }
        }
    }

    /**
     * Returns the data value for this component.
     */
    public get dataValue(): any {
        return util.get(this.data, this.component.key);
    }

    /**
     * Sets the datavalue for this component.
     */
    public set dataValue(value: any) {
        util.set(this.data, this.component.key, value);
    }

    /**
     * Returns the main HTML Element for this component.
     */
    getElement(): (HTMLElement | undefined) {
        return this.element;
    }

    /**
     * Remove all event handlers.
     */
    detach() {
        this.refs = {};
        this.removeAllListeners();
    }

    /**
     * Clear an element.
     */
    clear() {
        this.detach();
        dom.empty(this.getElement());
    }

    /**
     * Appends an element to this component.
     * @param element
     */
    append(element: (HTMLElement | undefined)) {
        dom.appendTo(element, this.element);
    }

    /**
     * Prepends an element to this component.
     * @param element
     */
    prepend(element: (HTMLElement | undefined)) {
        dom.prependTo(element, this.element);
    }

    /**
     * Removes an element from this component.
     * @param element
     */
    removeChild(element: (HTMLElement | undefined)) {
        dom.removeChildFrom(element, this.element);
    }
}