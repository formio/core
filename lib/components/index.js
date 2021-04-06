"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = require("./html/html");
var htmlcontainer_1 = require("./htmlcontainer/htmlcontainer");
var datatable_1 = require("./datatable/datatable");
var datavalue_1 = require("./datavalue/datavalue");
var input_1 = require("./input/input");
exports.default = {
    html: html_1.HTMLComponent,
    htmlcontainer: htmlcontainer_1.HTMLContainerComponent,
    datatable: datatable_1.DataTableComponent,
    datavalue: datavalue_1.DataValueComponent,
    input: input_1.InputComponent
};
