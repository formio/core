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
exports.DataValueComponent = void 0;
var Components_1 = require("../../core/Components");
var html_1 = require("../html/html");
var DataValueComponent = /** @class */ (function (_super) {
    __extends(DataValueComponent, _super);
    function DataValueComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DataValueComponent;
}(html_1.HTMLComponentBase({
    type: 'datavalue',
    template: function (ctx) {
        return "<" + ctx.tag + " ref=\"val\"" + ctx.attrs + ">" + ctx.value() + "</" + ctx.tag + ">";
    }
})));
exports.DataValueComponent = DataValueComponent;
Components_1.Components.addComponent(DataValueComponent);
