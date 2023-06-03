"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLComponent = exports.HTML = exports.HTMLProperties = void 0;
const base_1 = require("../../base");
exports.HTMLProperties = {
    type: 'html',
    schema: {
        tag: 'span',
        content: '',
        attrs: [],
        className: ''
    },
    template: (ctx) => {
        return `<${ctx.tag} ref="${ctx.ref}"${ctx.attrs}>${ctx.t(ctx.content)}</${ctx.tag}>`;
    }
};
/**
 * Base class for HTML based components.
 */
class HTML {
    constructor(component, options, data) {
        this.component = component;
        this.options = options;
        this.data = data;
    }
    getAttributes() {
        let hasClass = false;
        let attrs = '';
        for (let i in this.component.attrs) {
            if (this.component.attrs.hasOwnProperty(i)) {
                const attrValue = this.component.attrs[i];
                const isString = Number.isNaN(parseInt(i));
                let attr = isString ? i : attrValue.attr;
                const value = isString ? attrValue : attrValue.value;
                if (attr === 'class' && this.component.className) {
                    hasClass = true;
                    attr += ` ${this.component.className}`;
                }
                attrs += ` ${attr}="${this.interpolate(value, this.evalContext())}"`;
            }
        }
        if (!hasClass && this.component.className) {
            attrs += ` class="${this.interpolate(this.component.className, this.evalContext())}"`;
        }
        return attrs;
    }
    renderContext(extend = {}) {
        return Object.assign({
            tag: this.component.tag,
            ref: this.component.type,
            content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
            attrs: this.getAttributes()
        }, extend);
    }
}
exports.HTML = HTML;
let HTMLComponent = exports.HTMLComponent = class HTMLComponent extends HTML {
};
exports.HTMLComponent = HTMLComponent = __decorate([
    (0, base_1.Component)(exports.HTMLProperties)
], HTMLComponent);
