"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __importDefault(require("../html/html"));
exports.default = __assign(__assign({}, html_1.default), {
    type: 'htmlcontainer',
    extends: 'nested',
    methods: __assign(__assign({}, html_1.default.methods), {
        renderContext: function (_super, extend) {
            if (extend === void 0) { extend = {}; }
            return html_1.default.methods.renderContext.call(this, _super, Object.assign({
                content: this.renderComponents()
            }, extend));
        }
    })
});
