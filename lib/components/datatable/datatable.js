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
exports.DataTableComponent = void 0;
var Components_1 = require("../../core/Components");
var ArrayComponent_1 = require("../../core/array/ArrayComponent");
var DataTableComponent = /** @class */ (function (_super) {
    __extends(DataTableComponent, _super);
    function DataTableComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataTableComponent.prototype.renderClasses = function () {
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
    };
    DataTableComponent.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return Object.assign({
            classes: this.renderClasses()
        }, extend);
    };
    return DataTableComponent;
}(ArrayComponent_1.ArrayComponent({
    type: 'datatable',
    schema: {
        bordered: true,
        striped: false,
        hover: true,
        condensed: true
    },
    template: 'datatable',
})));
exports.DataTableComponent = DataTableComponent;
Components_1.Components.addComponent(DataTableComponent);
