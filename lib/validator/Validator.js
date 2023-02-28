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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
/**
 * Create a new component data validator.
 *
 * const validator = new Validator(component, {
 *   required: true,
 *   pattern: '[0-9]+',
 *   minLength: 10,
 *   maxLength: 20
 * });
 * const isValid = await validator.check();
 */
var Validator = /** @class */ (function () {
    function Validator(component, ruleOptions) {
        this.component = component;
        this.ruleOptions = ruleOptions;
        this.rules = {};
        this.errors = [];
        // Iterate over all the rules and create the rule instances.
        for (var ruleName in ruleOptions) {
            if (ruleOptions.hasOwnProperty(ruleName)) {
                this.addRule(ruleName, ruleOptions[ruleName]);
            }
        }
    }
    Validator.addRules = function (rules) {
        Validator.rules = __assign(__assign({}, Validator.rules), rules);
    };
    Validator.fromComponent = function (component) {
        var rules = component.component.validate || {};
        // These validations are outside of validate object.
        if (component.component.unique) {
            rules.unique = true;
        }
        return new this(component, rules);
    };
    Validator.prototype.addRule = function (name, settings) {
        if (!!settings && Validator.rules.hasOwnProperty(name)) {
            this.rules[name] = new Validator.rules[name](this.component, settings);
        }
    };
    Validator.prototype.removeRule = function (name) {
        if (this.rules.hasOwnProperty(name)) {
            delete this.rules[name];
        }
    };
    Validator.prototype.check = function (value, config) {
        if (value === void 0) { value = this.component.dataValue; }
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _i, ruleName, rule, isValid, component;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.errors = [];
                        if (this.component.isValueRedacted()) {
                            return [2 /*return*/, true];
                        }
                        _a = this.rules;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        ruleName = _c;
                        if (!this.rules.hasOwnProperty(ruleName)) return [3 /*break*/, 3];
                        rule = this.rules[ruleName];
                        return [4 /*yield*/, rule.check(value, config)];
                    case 2:
                        isValid = _d.sent();
                        if (isValid !== true) {
                            component = this.component.component;
                            this.errors.push({
                                type: ruleName,
                                settings: rule.settings,
                                message: this.component.interpolate(rule.defaultMessage, {
                                    error: isValid,
                                    settings: rule.settings,
                                    field: component.label || component.title || component.key
                                })
                            });
                        }
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, this.errors.length === 0];
                }
            });
        });
    };
    Validator.prototype.getErrorInfo = function () {
        return this.errors.length ? {
            component: this.component.component,
            value: this.component.dataValue,
            errors: this.errors
        } : null;
    };
    Validator.rules = {};
    return Validator;
}());
exports.Validator = Validator;
;
