"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTableComponent = void 0;
var Components_1 = require("../../core/Components");
var ArrayComponent_1 = require("../../core/array/ArrayComponent");
var DataTableComponent = /** @class */ (function () {
    function DataTableComponent(component, options, data) {
        this.component = component;
        this.options = options;
        this.data = data;
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
    DataTableComponent = __decorate([
        ArrayComponent_1.ArrayComponent({
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
}());
exports.DataTableComponent = DataTableComponent;
Components_1.Components.addComponent(DataTableComponent, 'datatable');
