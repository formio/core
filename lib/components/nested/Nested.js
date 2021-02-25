"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedComponent = void 0;
var Component_1 = require("../component/Component");
var index_1 = require("../index");
var NestedComponent = /** @class */ (function (_super) {
    __extends(NestedComponent, _super);
    function NestedComponent(component, options, data) {
        if (options === void 0) { options = {}; }
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, component, options, data) || this;
        _this.component = component;
        _this.components = [];
        (_this.component.components || []).forEach(function (comp) {
            _this.components.push(index_1.Components.createComponent(comp, _this.options, _this.data));
        });
        return _this;
    }
    NestedComponent.prototype.render = function () {
        return this.renderTemplate('nested', {
            content: this.components.reduce(function (tpl, comp) {
                return tpl + comp.render();
            }, '')
        });
    };
    return NestedComponent;
}(Component_1.Component));
exports.NestedComponent = NestedComponent;
