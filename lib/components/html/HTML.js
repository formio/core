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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLComponent = exports.HTMLComponentBase = void 0;
var Components_1 = require("../../core/Components");
var Component_1 = require("../../core/component/Component");
function HTMLComponentBase(props, BaseComponent) {
    if (props === void 0) { props = {}; }
    if (BaseComponent === void 0) { BaseComponent = Component_1.Component; }
    return /** @class */ (function (_super) {
        __extends(HTMLComponent, _super);
        function HTMLComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
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
            return _super.prototype.renderContext.call(this, Object.assign({
                tag: this.component.tag,
                ref: this.component.type,
                content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
                attrs: this.getAttributes()
            }, extend));
        };
        return HTMLComponent;
    }(BaseComponent({
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
    }, props)));
}
exports.HTMLComponentBase = HTMLComponentBase;
var HTMLComponent = /** @class */ (function (_super) {
    __extends(HTMLComponent, _super);
    function HTMLComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HTMLComponent;
}(HTMLComponentBase()));
exports.HTMLComponent = HTMLComponent;
Components_1.Components.addComponent(HTMLComponent);
