"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
var html_1 = __importDefault(require("./html/html"));
var htmlcontainer_1 = __importDefault(require("./htmlcontainer/htmlcontainer"));
var datatable_1 = __importDefault(require("./datatable/datatable"));
var datavalue_1 = __importDefault(require("./datavalue/datavalue"));
core_1.Components.importComponent(html_1.default);
core_1.Components.importComponent(htmlcontainer_1.default);
core_1.Components.importComponent(datatable_1.default);
core_1.Components.importComponent(datavalue_1.default);
