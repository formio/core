import { Component, ComponentSchema, ComponentOptions } from '../component/Component';
import { Components } from '../index';
import * as _ from '../../util/util';

export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}

export class NestedComponent extends Component {
    public components: Array<Component>;
    public template: string = 'nested';
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
        super(component, options, data);
        this.components = [];
        this.initComponents();
    }

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
                this.components.splice(index, 1);
            }
        });
    }

    createComponent(component: ComponentSchema, data: any): Component {
        const comp = Components.createComponent(component, this.options, data);
        comp.parent = this;
        comp.root = this.root || this;
        return comp;
    }

    createComponents(data: any): Array<Component> {
        const added: Array<Component> = [];
        (this.component.components || []).forEach((comp: ComponentSchema) => {
            const newComp = this.createComponent(comp, data);
            this.components.push(newComp);
            added.push(newComp);
        });
        return added;
    }

    initComponents() {
        this.createComponents(this.componentData());
    }

    renderContext(context: any = {}) {
        context.content = this.components.reduce((tpl: string, comp: Component) => {
            return tpl + comp.render();
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
     * Sets the datavalue for this component.
     */
    public set dataValue(value: any) {
        if (Object.keys(value).length) {
            this.eachComponent((comp: Component) => {
                comp.dataValue = _.get(value, comp.component.key);
            });
        }
    }
}