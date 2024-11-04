import { ArrayComponent } from '../base';

/**
 * A base class for a data table.
 */
export class DataTable {
  [x: string]: any;
  constructor(
    public component?: any,
    public options?: any,
    public data?: any,
  ) {}
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
    return Object.assign(
      {
        classes: this.renderClasses(),
      },
      extend,
    );
  }
}

@ArrayComponent({
  type: 'datatable',
  schema: {
    bordered: true,
    striped: false,
    hover: true,
    condensed: true,
  },
  template: 'datatable',
})
export class DataTableComponent extends DataTable {}
