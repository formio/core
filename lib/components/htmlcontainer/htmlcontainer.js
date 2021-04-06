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
exports.HTMLContainerComponent = void 0;
var Components_1 = require("../../core/Components");
var html_1 = require("../html/html");
var NestedComponent_1 = require("../../core/nested/NestedComponent");
var HTMLContainerComponent = /** @class */ (function (_super) {
    __extends(HTMLContainerComponent, _super);
    function HTMLContainerComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HTMLContainerComponent.prototype.renderContext = function (extend) {
        if (extend === void 0) { extend = {}; }
        return _super.prototype.renderContext.call(this, Object.assign({
            content: this.renderComponents()
        }, extend));
    };
    return HTMLContainerComponent;
}(html_1.HTMLComponentBase({
    type: 'htmlcontainer'
}, NestedComponent_1.NestedComponent)));
exports.HTMLContainerComponent = HTMLContainerComponent;
Components_1.Components.addComponent(HTMLContainerComponent);
