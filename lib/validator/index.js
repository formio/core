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
exports.Rule = exports.Rules = exports.Validator = void 0;
var rules_1 = __importDefault(require("./rules"));
exports.Rules = rules_1.default;
var Validator = /** @class */ (function () {
    function Validator() {
    }
    Validator.addRules = function (rules) {
        Validator.rules = __assign(__assign({}, Validator.rules), rules);
    };
    Validator.rules = rules_1.default;
    return Validator;
}());
exports.Validator = Validator;
;
var Rule_1 = require("./rules/Rule");
Object.defineProperty(exports, "Rule", { enumerable: true, get: function () { return Rule_1.Rule; } });
