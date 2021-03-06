"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'html',
    extends: 'component',
    schema: {
        tag: 'span',
        content: '',
        attrs: [],
        className: ''
    },
    template: function (ctx) {
        return "<" + ctx.tag + " ref=\"" + ctx.ref + "\"" + ctx.attrs + ">" + ctx.t(ctx.content) + "</" + ctx.tag + ">";
    },
    methods: {
        getAttributes: function () {
            var hasClass = false;
            var attrs = '';
            for (var i in this.component.attrs) {
                if (this.component.attrs.hasOwnProperty(i)) {
                    var attrValue = this.component.attrs[i];
                    var isString = Number.isNaN(parseInt(i));
                    var attr = isString ? i : attrValue.attr;
                    var value = isString ? attrValue : attrValue.value;
                    if (attr === 'class' && this.component.className) {
                        hasClass = true;
                        attr += " " + this.component.className;
                    }
                    attrs += " " + attr + "=\"" + this.interpolate(value, this.evalContext()) + "\"";
                }
            }
            if (!hasClass && this.component.className) {
                attrs += " class=\"" + this.interpolate(this.component.className, this.evalContext()) + "\"";
            }
            return attrs;
        },
        renderContext: function (_super, extend) {
            if (extend === void 0) { extend = {}; }
            return _super(Object.assign({
                tag: this.component.tag,
                ref: this.component.type,
                content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
                attrs: this.getAttributes(this)
            }, extend));
        }
    }
};
