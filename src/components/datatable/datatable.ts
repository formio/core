import { Components } from '../../core/Components';
import { ArrayComponent } from '../../core/array/ArrayComponent';
export class DataTableComponent extends ArrayComponent({
    type: 'datatable',
    schema: {
        bordered: true,
        striped: false,
        hover: true,
        condensed: true
    },
    template: 'datatable',
}) {
    renderClasses() {
        let classes = '';
        if (this.component.bordered) {
            classes += ' table-bordered';
        }
        if (this.component.striped) {
            classes += ' table-striped';
        }
        if (this.component.hover) {
            classes += ' table-hover';
        }
        if (this.component.condensed) {
            classes += ' table-condensed';
        }
        return classes;
    }

    renderContext(extend: any = {}): any {
        return Object.assign({
            classes: this.renderClasses()
        }, extend);
    }
}

Components.addComponent(DataTableComponent);