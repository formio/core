"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    extends: 'component',
    schema: {
        tag: 'span',
        content: '',
        attrs: []
    },
    template: function (ctx) {
        return "<" + ctx.tag + " class=\"" + ctx.component.className + "\" ref=\"html\"\n        " + ctx.attrs.map(function (attr) {
            return attr.attr + '="' + attr.value + '"';
        }).join(" ") + "\n      >" + ctx.t(ctx.content) + "</" + ctx.tag + ">";
    },
    methods: {
        renderContext: function (_super) {
            var _this = this;
            return _super({
                tag: this.component.tag,
                content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
                attrs: (this.component.attrs || []).map(function (attr) {
                    return {
                        attr: attr.attr,
                        value: _this.interpolate(attr.value, _this.evalContext())
                    };
                })
            });
        }
    }
};
