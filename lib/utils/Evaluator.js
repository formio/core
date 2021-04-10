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
exports.Evaluator = exports.BaseEvaluator = void 0;
var _ = __importStar(require("@formio/lodash"));
// BaseEvaluator is for extending.
var BaseEvaluator = /** @class */ (function () {
    function BaseEvaluator() {
    }
    BaseEvaluator.evaluator = function (func) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }
        if (typeof func === 'function') {
            return func;
        }
        if (typeof params[0] === 'object') {
            params = _.keys(params[0]);
        }
        return new (Function.bind.apply(Function, __spreadArray(__spreadArray([void 0], params), [func])))();
    };
    ;
    BaseEvaluator.interpolateString = function (rawTemplate, data) {
        return rawTemplate.replace(/({{\s*(.*?)\s*}})/g, function (match, $1, $2) {
            // If this is a function call and we allow evals.
            if ($2.indexOf('(') !== -1) {
                return $2.replace(/([^\(]+)\(([^\)]+)\s*\);?/, function (evalMatch, funcName, args) {
                    funcName = _.trim(funcName);
                    var func = _.get(data, funcName);
                    if (func) {
                        if (args) {
                            args = args.split(',').map(function (arg) {
                                arg = _.trim(arg);
                                if ((arg.indexOf('"') === 0) || (arg.indexOf("'") === 0)) {
                                    return arg.substring(1, arg.length - 1);
                                }
                                return _.get(data, arg);
                            });
                        }
                        return Evaluator.evaluate(func, args, '', false, data);
                    }
                    return '';
                });
            }
            else {
                return _.get(data, $2);
            }
        });
    };
    BaseEvaluator.interpolate = function (rawTemplate, data) {
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
    /**
     * Evaluate a method.
     *
     * @param func
     * @param args
     * @return {*}
     */
    BaseEvaluator.evaluate = function (func, args, ret, interpolate, context) {
        if (args === void 0) { args = {}; }
        if (ret === void 0) { ret = ''; }
        if (interpolate === void 0) { interpolate = false; }
        if (context === void 0) { context = {}; }
        var returnVal = null;
        var component = args.component ? args.component : { key: 'unknown' };
        if (!args.form && args.instance) {
            args.form = _.get(args.instance, 'root._form', {});
        }
        var componentKey = component.key;
        if (typeof func === 'string') {
            if (ret) {
                func += ";return " + ret;
            }
            if (interpolate) {
                func = BaseEvaluator.interpolate(func, args);
            }
            try {
                func = Evaluator.evaluator(func, args, context);
                args = _.values(args);
            }
            catch (err) {
                console.warn("An error occured within the custom function for " + componentKey, err);
                returnVal = null;
                func = false;
            }
        }
        if (typeof func === 'function') {
            try {
                returnVal = Evaluator.execute(func, args, context);
            }
            catch (err) {
                returnVal = null;
                console.warn("An error occured within custom function for " + componentKey, err);
            }
        }
        else if (func) {
            console.warn("Unknown function type for " + componentKey);
        }
        return returnVal;
    };
    /**
     * Execute a function.
     *
     * @param func
     * @param args
     * @returns
     */
    BaseEvaluator.execute = function (func, args, context) {
        if (context === void 0) { context = {}; }
        if (Evaluator.noeval) {
            console.warn('No evaluations allowed for this renderer.');
            return _.noop;
        }
        return Array.isArray(args) ? func.apply(context, args) : func.call(context, args);
    };
    ;
    BaseEvaluator.templateSettings = {
        interpolate: /{{([\s\S]+?)}}/g,
    };
    BaseEvaluator.noeval = false;
    return BaseEvaluator;
}());
exports.BaseEvaluator = BaseEvaluator;
// The extendable evaluator
var Evaluator = /** @class */ (function (_super) {
    __extends(Evaluator, _super);
    function Evaluator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Allow external modules the ability to extend the Evaluator.
     * @param evaluator
     */
    Evaluator.registerEvaluator = function (evaluator) {
        Object.keys(evaluator).forEach(function (key) {
            Evaluator[key] = evaluator[key];
        });
    };
    return Evaluator;
}(BaseEvaluator));
exports.Evaluator = Evaluator;
