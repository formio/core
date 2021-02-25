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
exports.ArrayComponent = void 0;
var NestedComponent_1 = require("../nested/NestedComponent");
var ArrayComponent = /** @class */ (function (_super) {
    __extends(ArrayComponent, _super);
    function ArrayComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ArrayComponent;
}(NestedComponent_1.NestedComponent));
exports.ArrayComponent = ArrayComponent;
