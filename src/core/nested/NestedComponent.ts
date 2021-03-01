import { Component, ComponentSchema, ComponentOptions } from '../component/Component';
import { Components } from '..';
import * as _ from '../../util/util';

export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}

/**
 * Provides a nested component structure, where components can be nested within other components.
 */
export class NestedComponent extends Component {
    public components: Array<Component>;
    public template: any = (ctx: any) => `<div ref="nested">${ctx.content}</div>`;
    /**
     * The JSON schema for a base component.
     * @param extend
     */
    static schema(extend: any = {}): NestedComponent {
        if (!extend.components) {
            extend.components = [];
        }
        return Component.schema(extend);
    }

    constructor(
        component: (NestedComponentSchema | any),
        options: ComponentOptions = {},
        data: any = {}
    ) {
        super(component, {noInit: true, ...options}, data);
        this.components = [];
        if (!options.noInit) {
            this.init();
        }
    }

    /**
     * Initialize the nested component as well as create all nested components.
     */
    public init() {
        super.init();
        this.initComponents();
    }

    /**
     * Return the default schema for this component.
     */
    public get defaultSchema() {
        return NestedComponent.schema();
    }

    getComponents(): Array<Component> {
        return this.components || [];
    }

    /**
     * Perform an iteration over each component within this container component.
     *
     * @param {function} fn - Called for each component
     */
    eachComponent(fn: Function) {
        _.each(this.getComponents(), (component: Component, index: any) => {
            if (fn(component, index) === false) {
                return false;
            }
        });
    }

    /**
     * Attach a html element to this nestd component.
     * @param element 
     */
    public async attach(element: HTMLElement) {
        await super.attach(element);
        if (this.element) {
            const promises: any = [];
            const children = this.element.querySelectorAll(`[data-within="${this.id}"]`);
            Array.prototype.slice.call(children).forEach((child: HTMLElement, index: any) => {
                promises.push(this.components[index].attach(child));
            });
            await Promise.all(promises);
        }
        return this;
    }

    /**
     * Detach components.
     */
    detach() {
        super.detach();
        this.eachComponent((comp: Component) => comp.detach());
    }

    componentData() {
        return this.data;
    }

    removeComponent(component: Component) {
        (this.components || []).forEach((comp: Component, index: number) => {
            if (comp === component) {
                comp.detach();
                this.components?.splice(index, 1);
            }
        });
    }

    createComponent(component: ComponentSchema, data: any): Component {
        const comp = Components.createComponent(component, {
            noInit: true,
            ...this.options
        }, data);
        comp.parent = this;
        comp.root = this.root || this;
        comp.init();
        return comp;
    }

    createComponents(data: any): Array<Component> {
        const added: Array<Component> = [];
        (this.component.components || []).forEach((comp: ComponentSchema) => {
            const newComp = this.createComponent(comp, data);
            this.components?.push(newComp);
            added.push(newComp);
        });
        return added;
    }

    initComponents() {
        this.createComponents(this.componentData());
    }

    renderContext(context: any = {}) {
        context.content = this.components?.reduce((tpl: string, comp: Component) => {
            return tpl + comp.render().replace(/(<[^\>]+)/, `$1 data-within="${this.id}"`);
        }, '');
        return super.renderContext(context);
    }

    /**
     * Get the datavalue of this component.
     */
    public get dataValue() {
        return this.data;
    }

    /**
     * Iterate through each component value.
     * 
     * @param value The context data value.
     * @param fn Callback to be called with the component and the value for that component.
     */
    public eachComponentValue(value: any, fn: any) {
        if (Object.keys(value).length) {
            this.eachComponent((comp: Component) => {
                fn(comp, _.get(value, comp.component.key));
            });
        }
    }

    /**
     * Sets the datavalue for this component.
     */
    public set dataValue(value: any) {
        this.eachComponentValue(value, (comp: any, val: any) => {
            comp.dataValue = val;
        });
    }

    /**
     * Sets the value for a data component.
     * 
     * @param value 
     */
    public setValue(value: any): boolean {
        var changed = false;
        this.eachComponentValue(value, (comp: any, val: any) => {
            changed = comp.setValue(val) || changed;
        });
        return changed;
    }
}