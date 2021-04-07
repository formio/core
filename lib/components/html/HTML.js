"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLComponent = exports.HTMLProperties = void 0;
var Components_1 = require("../../core/Components");
var Component_1 = require("../../core/component/Component");
exports.HTMLProperties = {
    type: 'html',
    schema: {
        tag: 'span',
        content: '',
        attrs: [],
        className: ''
    },
    template: function (ctx) {
        return "<" + ctx.tag + " ref=\"" + ctx.ref + "\"" + ctx.attrs + ">" + ctx.t(ctx.content) + "</" + ctx.tag + ">";
    }
};
var HTMLComponent = /** @class */ (function () {
    function HTMLComponent(component, options, data) {
        this.component = component;
        this.options = options;
        this.data = data;
    }
    HTMLComponent.prototype.getAttributes = function () {
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
    };
    HTMLComponent.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return Object.assign({
            tag: this.component.tag,
            ref: this.component.type,
            content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
            attrs: this.getAttributes()
        }, extend);
    };
    HTMLComponent = __decorate([
        Component_1.Component(exports.HTMLProperties)
    ], HTMLComponent);
    return HTMLComponent;
}());
exports.HTMLComponent = HTMLComponent;
Components_1.Components.addComponent(HTMLComponent, 'html');
