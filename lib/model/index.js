"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = void 0;
var Models = /** @class */ (function () {
    function Models() {
    }
    Models.getModelType = function (component) {
        switch (component.type) {
            case 'datagrid':
            case 'editgrid':
                return 'array';
            case 'datamap':
            case 'container':
                return 'map';
            case 'form':
                return 'form';
            case 'number':
            case 'currency':
                return 'number';
            default:
                return component.hasOwnProperty('components') ? 'none' : 'value';
        }
    };
    Models.create = function (component, data) {
        var type = Models.getModelType(component);
        if (Models.models.hasOwnProperty(type)) {
            return new Models.models[type](component, data);
        }
        else {
            return new Models.models.value(component, data);
        }
    };
    Models.models = {};
    return Models;
}());
exports.Models = Models;
