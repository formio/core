"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'datatable',
    extends: 'array',
    schema: {
        bordered: true,
        striped: false,
        hover: true,
        condensed: true
    },
    methods: {
        renderClasses: function () {
            var classes = '';
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
        renderContext: function (_super) {
            return _super({
                classes: this.renderClasses()
            });
        }
    }
};
