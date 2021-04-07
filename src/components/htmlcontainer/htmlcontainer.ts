import { Components } from '../../core/Components';
import { HTMLComponent, HTMLProperties } from '../html/html';
import { NestedComponent } from '../../core/nested/NestedComponent';

@NestedComponent({
    type: 'htmlcontainer',
    schema: HTMLProperties.schema,
    template: HTMLProperties.template
})
export class HTMLContainerComponent extends HTMLComponent {
    renderContext(extend: any = {}) {
        return super.renderContext(Object.assign({
            content: this.renderComponents()
        }, extend));
    }
}
Components.addComponent(HTMLContainerComponent, 'htmlcontainer');