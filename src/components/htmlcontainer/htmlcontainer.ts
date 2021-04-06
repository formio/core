import { Components } from '../../core/Components';
import { HTMLComponentBase } from '../html/html';
import { NestedComponent } from '../../core/nested/NestedComponent';
export class HTMLContainerComponent extends HTMLComponentBase({
    type: 'htmlcontainer'
}, NestedComponent) {
    renderContext(extend: any = {}) {
        return super.renderContext(Object.assign({
            content: this.renderComponents()
        }, extend));
    }
}
Components.addComponent(HTMLContainerComponent);