"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONLogicEvaluator = void 0;
const utils_1 = require("../../utils");
const rules_1 = __importDefault(require("./rules"));
const jsonLogic_1 = require("./jsonLogic");
class JSONLogicEvaluator extends utils_1.BaseEvaluator {
    static evaluate(func, args = {}, ret = '', tokenize = false, context = {}) {
        let returnVal = null;
        if (typeof func === 'object') {
            try {
                returnVal = jsonLogic_1.jsonLogic.apply(func, args);
            }
            catch (err) {
                returnVal = null;
                console.warn(`An error occured within JSON Logic`, err);
            }
        }
        else {
            returnVal = utils_1.BaseEvaluator.evaluate(func, args, ret, tokenize, context);
        }
        return returnVal;
    }
}
exports.JSONLogicEvaluator = JSONLogicEvaluator;
exports.default = {
    evaluator: JSONLogicEvaluator,
    rules: rules_1.default,
    jsonLogic: jsonLogic_1.jsonLogic
};
