import { Components } from '../Components';
import { ComponentWithModel, ComponentSchema, ComponentInterface } from '../component/Component';
import { NestedModel } from '../../model/NestedModel';
import * as _ from '@formio/lodash';

export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}

export const NestedComponentBase = ComponentWithModel(NestedModel(Components));
export function NestedComponentWithModel(ModelClass: any) {
    return function NestedComponent(...props: any) : ComponentInterface {
        props.unshift({type: 'nested'});
        return class ExtendedNestedComponent extends ModelClass(...props) {
            public get defaultTemplate(): any {
                return (ctx: any) => `<div ref="nested">${ctx.instance.renderComponents()}</div>`;
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
                this.eachComponent((comp: any) => comp.detach());
            }

            renderComponents() {
                return this.components?.reduce((tpl: string, comp: any) => {
                    return tpl + comp.      render().replace(/(<[^\>]+)/, `$1 data-within="${this.id}"`);
                }, '');
            }
        }
    };
}
export const NestedComponent = NestedComponentWithModel(NestedComponentBase);
Components.addBaseComponent(NestedComponent, 'nested');
Components.addComponent(NestedComponent());