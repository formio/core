import { Component, ComponentSchema } from '../component/Component';
import { Components } from '../index';
import * as _ from '@formio/lodash';
import { NestedModel } from '../../model/NestedModel';

export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}

/**
 * Provides a nested component structure, where components can be nested within other components.
 */
export class NestedComponent extends NestedModel(Component, Components) {
    public template: any = (ctx: any) => `<div ref="nested">${ctx.instance.renderComponents()}</div>`;
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

    /**
     * Return the default schema for this component.
     */
    public get defaultSchema() {
        return NestedComponent.schema();
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
        this.eachChild((comp: Component) => comp.detach());
    }

    renderComponents() {
        return this.children?.reduce((tpl: string, comp: Component) => {
            return tpl + comp.render().replace(/(<[^\>]+)/, `$1 data-within="${this.id}"`);
        }, '');
    }
}