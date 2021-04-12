import { NestedComponent } from '@formio/base';
import { HTML, HTMLProperties } from '../html/html';

/**
 * Base HTMLContainer component.
 */
export class HTMLContainer extends HTML {
    renderContext(extend: any = {}) {
        return super.renderContext(Object.assign({
            content: this.renderComponents()
        }, extend));
    }
}

@NestedComponent({
    type: 'htmlcontainer',
    schema: HTMLProperties.schema,
    template: HTMLProperties.template
})
export class HTMLContainerComponent extends HTMLContainer {}