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
exports.DataTableComponent = exports.DataTable = void 0;
var base_1 = require("@formio/base");
/**
 * A base class for a data table.
 */
var DataTable = /** @class */ (function () {
    function DataTable(component, options, data) {
        this.component = component;
        this.options = options;
        this.data = data;
    }
    DataTable.prototype.renderClasses = function () {
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
    DataTable.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return Object.assign({
            classes: this.renderClasses()
        }, extend);
    };
    return DataTable;
}());
exports.DataTable = DataTable;
var DataTableComponent = /** @class */ (function (_super) {
    __extends(DataTableComponent, _super);
    function DataTableComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataTableComponent = __decorate([
        base_1.ArrayComponent({
            type: 'datatable',
            schema: {
                bordered: true,
                striped: false,
                hover: true,
                condensed: true
            },
            template: 'datatable',
        })
    ], DataTableComponent);
    return DataTableComponent;
}(DataTable));
exports.DataTableComponent = DataTableComponent;
