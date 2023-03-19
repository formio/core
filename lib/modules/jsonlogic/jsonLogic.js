"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonLogic = void 0;
const json_logic_js_1 = __importDefault(require("json-logic-js"));
exports.jsonLogic = json_logic_js_1.default;
const _ = __importStar(require("@formio/lodash"));
const dayjs_1 = __importDefault(require("dayjs"));
const operators_1 = require("./operators/operators");
// Configure JsonLogic
operators_1.lodashOperators.forEach((name) => {
    if (_[name]) {
        json_logic_js_1.default.add_operation(`_${name}`, _[name]);
    }
});
// Retrieve Any Date
json_logic_js_1.default.add_operation('getDate', (date) => {
    return (0, dayjs_1.default)(date).toISOString();
});
// Set Relative Minimum Date
json_logic_js_1.default.add_operation('relativeMinDate', (relativeMinDate) => {
    return (0, dayjs_1.default)().subtract(relativeMinDate, 'days').toISOString();
});
// Set Relative Maximum Date
json_logic_js_1.default.add_operation('relativeMaxDate', (relativeMaxDate) => {
    return (0, dayjs_1.default)().add(relativeMaxDate, 'days').toISOString();
});
