"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Evaluator = void 0;
var _ = __importStar(require("./lodash"));
var Evaluator = /** @class */ (function () {
    function Evaluator() {
    }
    Evaluator.evaluator = function (func) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }
        if (typeof params[0] === 'object') {
            params = _.keys(params[0]);
        }
        return new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], params), [func])))();
    };
    ;
    Evaluator.interpolateString = function (rawTemplate, data) {
        return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, function (match, $1, $2) { return _.get(data, $2); });
    };
    Evaluator.interpolate = function (rawTemplate, data) {
        if (typeof rawTemplate === 'function') {
            try {
                return rawTemplate(data);
            }
            catch (err) {
                console.warn('Error interpolating template', err, data);
                return err.message;
            }
        }
        return Evaluator.interpolateString(String(rawTemplate), data);
    };
    ;
    Evaluator.noeval = false;
    return Evaluator;
}());
exports.Evaluator = Evaluator;
