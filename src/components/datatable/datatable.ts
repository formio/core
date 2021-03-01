export default {
    type: 'datatable',
    extends: 'array',
    schema: {
        bordered: true,
        striped: false,
        hover: true,
        condensed: true
    },
    template: 'datatable',
    methods: {
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
        },
        renderContext(_super: any): any {
            return _super({
                classes: this.renderClasses()
            });
        }
    }
};