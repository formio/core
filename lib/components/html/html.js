"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLComponent = exports.HTML = exports.HTMLProperties = void 0;
var base_1 = require("../../base");
exports.HTMLProperties = {
    type: 'html',
    schema: {
        tag: 'span',
        content: '',
        attrs: [],
        className: ''
    },
    template: function (ctx) {
        return "<".concat(ctx.tag, " ref=\"").concat(ctx.ref, "\"").concat(ctx.attrs, ">").concat(ctx.t(ctx.content), "</").concat(ctx.tag, ">");
    }
};
/**
 * Base class for HTML based components.
 */
var HTML = /** @class */ (function () {
    function HTML(component, options, data) {
        this.component = component;
        this.options = options;
        this.data = data;
    }
    HTML.prototype.getAttributes = function () {
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
                    attr += " ".concat(this.component.className);
                }
                attrs += " ".concat(attr, "=\"").concat(this.interpolate(value, this.evalContext()), "\"");
            }
        }
        if (!hasClass && this.component.className) {
            attrs += " class=\"".concat(this.interpolate(this.component.className, this.evalContext()), "\"");
        }
        return attrs;
    };
    HTML.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return Object.assign({
            tag: this.component.tag,
            ref: this.component.type,
            content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
            attrs: this.getAttributes()
        }, extend);
    };
    return HTML;
}());
exports.HTML = HTML;
var HTMLComponent = /** @class */ (function (_super) {
    __extends(HTMLComponent, _super);
    function HTMLComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLComponent = __decorate([
        (0, base_1.Component)(exports.HTMLProperties)
    ], HTMLComponent);
    return HTMLComponent;
}(HTML));
exports.HTMLComponent = HTMLComponent;
