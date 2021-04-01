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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLogicEvaluator = void 0;
var Evaluator_1 = require("../../util/Evaluator");
var rules_1 = __importDefault(require("./rules"));
var jsonLogic_1 = require("./jsonLogic");
var JSONLogicEvaluator = /** @class */ (function (_super) {
    __extends(JSONLogicEvaluator, _super);
    function JSONLogicEvaluator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JSONLogicEvaluator.evaluate = function (func, args, ret, tokenize) {
        if (args === void 0) { args = {}; }
        if (ret === void 0) { ret = ''; }
        if (tokenize === void 0) { tokenize = false; }
        var returnVal = null;
        if (typeof func === 'object') {
            try {
                returnVal = jsonLogic_1.jsonLogic.apply(func, args);
            }
            catch (err) {
                returnVal = null;
                console.warn("An error occured within JSON Logic", err);
            }
        }
        else {
            returnVal = Evaluator_1.BaseEvaluator.evaluate(func, args, ret, tokenize);
        }
        return returnVal;
    };
    return JSONLogicEvaluator;
}(Evaluator_1.BaseEvaluator));
exports.JSONLogicEvaluator = JSONLogicEvaluator;
exports.default = {
    evaluator: JSONLogicEvaluator,
    rules: rules_1.default,
    jsonLogic: jsonLogic_1.jsonLogic
};
