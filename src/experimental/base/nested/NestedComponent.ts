import { Components } from '../Components';
import { ComponentSchema, Component } from '../component/Component';
import { NestedModel, ModelDecoratorInterface, ModelInterface } from '../../model';

export interface NestedComponentSchema extends ComponentSchema {
  components: Array<ComponentSchema | any>;
}

export function NestedComponent(props: any = {}): ModelDecoratorInterface {
  if (!props.type) {
    props.type = 'nested';
  }
  if (!props.model) {
    props.model = NestedModel;
  }
  if (!props.factory) {
    props.factory = Components;
  }
  return function (BaseClass?: ModelInterface): ModelInterface {
    return class ExtendedNestedComponent extends Component(props)(BaseClass) {
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
        return this.components.reduce((tpl: string, comp: any) => {
          return tpl + comp.render().replace(/(<[^>]+)/, `$1 data-within="${this.id}"`);
        }, '');
      }
    };
  };
}

Components.addDecorator(NestedComponent, 'nested');
Components.addComponent(NestedComponent()(), 'nested');
