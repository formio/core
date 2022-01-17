"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputComponent = exports.Input = exports.DataValueComponent = exports.DataTableComponent = exports.DataTable = exports.HTMLContainerComponent = exports.HTMLContainer = exports.HTMLComponent = exports.HTML = void 0;
var templates_1 = __importDefault(require("./templates"));
var html_1 = require("./html/html");
var htmlcontainer_1 = require("./htmlcontainer/htmlcontainer");
var datatable_1 = require("./datatable/datatable");
var datavalue_1 = require("./datavalue/datavalue");
var input_1 = require("./input/input");
var html_2 = require("./html/html");
Object.defineProperty(exports, "HTML", { enumerable: true, get: function () { return html_2.HTML; } });
Object.defineProperty(exports, "HTMLComponent", { enumerable: true, get: function () { return html_2.HTMLComponent; } });
var htmlcontainer_2 = require("./htmlcontainer/htmlcontainer");
Object.defineProperty(exports, "HTMLContainer", { enumerable: true, get: function () { return htmlcontainer_2.HTMLContainer; } });
Object.defineProperty(exports, "HTMLContainerComponent", { enumerable: true, get: function () { return htmlcontainer_2.HTMLContainerComponent; } });
var datatable_2 = require("./datatable/datatable");
Object.defineProperty(exports, "DataTable", { enumerable: true, get: function () { return datatable_2.DataTable; } });
Object.defineProperty(exports, "DataTableComponent", { enumerable: true, get: function () { return datatable_2.DataTableComponent; } });
var datavalue_2 = require("./datavalue/datavalue");
Object.defineProperty(exports, "DataValueComponent", { enumerable: true, get: function () { return datavalue_2.DataValueComponent; } });
var input_2 = require("./input/input");
Object.defineProperty(exports, "Input", { enumerable: true, get: function () { return input_2.Input; } });
Object.defineProperty(exports, "InputComponent", { enumerable: true, get: function () { return input_2.InputComponent; } });
exports.default = {
    components: {
        html: html_1.HTMLComponent,
        htmlcontainer: htmlcontainer_1.HTMLContainerComponent,
        datatable: datatable_1.DataTableComponent,
        datavalue: datavalue_1.DataValueComponent,
        input: input_1.InputComponent
    },
    templates: templates_1.default
};
