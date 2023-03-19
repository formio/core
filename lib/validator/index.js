"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = exports.Rules = exports.Validator = void 0;
const rules_1 = __importDefault(require("./rules"));
exports.Rules = rules_1.default;
const Validator_1 = require("./Validator");
Object.defineProperty(exports, "Validator", { enumerable: true, get: function () { return Validator_1.Validator; } });
Validator_1.Validator.addRules(rules_1.default);
var Rule_1 = require("./rules/Rule");
Object.defineProperty(exports, "Rule", { enumerable: true, get: function () { return Rule_1.Rule; } });
