import { Components } from '../Components';
import { Template } from '../../templates/Template';
import { Evaluator, sanitize, dom } from '../../util';
import { Model } from '../../model/Model';
import * as _ from '@formio/lodash';

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
    noInit?: boolean
}

export interface ComponentInterface {
    new (component?: any, options?: any, data?: any): any;
}

export function ComponentWithModel(ModelClass: any) {
    return function (...props: any) : ComponentInterface {
        props.unshift({
            type: 'component',
            schema: {
                persistent: true,
                protected: false,
            }
        });
        const compProps = props.length ? props.reduce((result: any, prop: any) => _.merge(result, prop), {}) : {};
        if (!compProps.type) {
            compProps.type = 'component';
        }
        compProps.schema.type = compProps.type;
        return class ExtendedComponent extends ModelClass(compProps) {
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
            public refs: any = {};

            /**
             * The template to render for this component.
             */
            public template: any = compProps.template;

            /**
             * An array of attached listeners.
             */
            public attachedListeners: Array<any> = [];


            public get defaultOptions(): any {
                return {
                    language: 'en',
                    namespace: 'formio'
                };
            }

            public get defaultTemplate(): any {
                return (ctx: any) => `<span>${ctx.t('Unknown Component')}</span>`;
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
                return context;
            }

            /**
             * Performs an evaluation using the evaluation context of this component.
             *
             * @param func
             * @param args
             * @param ret
             * @param tokenize
             * @return {*}
             */
            public evaluate(func: any, args: any = {}, ret: any = '', tokenize: boolean = false) {
                return Evaluator.evaluate(func, this.evalContext(args), ret, tokenize);
            }

            /**
             * Renders this component as an HTML string.
             */
            public render(context: any = {}): string {
                return this.renderTemplate((this.template || this.component.type), this.renderContext(context));
            }

            /**
             * Returns the template references.
             */
            public getRefs() {
                return {};
            }

            /**
             * Loads the elemement references.
             * @param element
             */
            loadRefs(element: HTMLElement) {
                const refs: any = this.getRefs();
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
            public async attach(element?: HTMLElement | undefined) {
                if (this.element && !element) {
                    element = this.element;
                }
                if (!element) {
                    return this;
                }
                const parent = element.parentNode;
                if (!parent) {
                    return this;
                }
                const index = Array.prototype.indexOf.call(parent.children, element);
                element.outerHTML = String(this.sanitize(this.render()));
                element = parent.children[index] as HTMLElement;
                this.element = element;
                this.loadRefs(this.element);
                this.attached = true;
                return this;
            }

            /**
             * Redraw this component.
             * @returns
             */
            public async redraw() {
                if (this.element) {
                    this.clear();
                    return this.attach();
                }
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
            public renderTemplate(name: any, ctx: any = {}): string {
                return Template.render(name, this.evalContext(ctx), 'html', this.defaultTemplate);
            }

            /**
             * Determines if the value of this component is redacted from the user as if it is coming from the server, but is protected.
             *
             * @return {boolean|*}
             */
            isValueRedacted() {
                return (
                    this.component.protected ||
                    !this.component.persistent ||
                    (this.component.persistent === 'client-only')
                );
            }

            /**
             * Sets the data value and updates the view representation.
             * @param value
             */
            public setValue(value: any): boolean {
                return this.updateValue(value);
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
                this.attached = false;
                this.removeAttachedListeners();
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
            addEventListener(obj: any, type: string, func: any) {
                if (!obj) {
                    return;
                }
                if ('addEventListener' in obj) {
                    obj.addEventListener(type, func, false);
                }
                else if ('attachEvent' in obj) {
                    obj.attachEvent(`on${type}`, func);
                }
                this.attachedListeners.push({ obj, type, func });
                return this;
            }

            /**
             * Remove all the attached listeners.
             */
            removeAttachedListeners() {
                this.attachedListeners.forEach((item) => this.removeEventListener(item.obj, item.type, item.func));
            }

            /**
             * Remove an event listener from the object.
             *
             * @param obj
             * @param type
             */
            removeEventListener(obj: any, type: string, func: any) {
                if (obj) {
                    obj.removeEventListener(type, func);
                }
                return this;
            }
        };
    }
}

export const Component = ComponentWithModel(Model);

// Add the default component.
Components.addBaseComponent(Component, 'component');
Components.addComponent(Component());