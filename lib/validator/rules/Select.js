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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectRule = void 0;
var Evaluator_1 = require("../../util/Evaluator");
var lodash_1 = require("@formio/lodash");
var fetch_ponyfill_1 = __importDefault(require("fetch-ponyfill"));
var _a = fetch_ponyfill_1.default(), fetch = _a.fetch, Headers = _a.Headers, Request = _a.Request;
var Rule_1 = require("./Rule");
var SelectRule = /** @class */ (function (_super) {
    __extends(SelectRule, _super);
    function SelectRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultMessage = '{{field}} contains an invalid selection';
        return _this;
    }
    SelectRule.prototype.check = function (value, data, row, async) {
        if (value === void 0) { value = this.component.dataValue; }
        return __awaiter(this, void 0, void 0, function () {
            var schema, requestOptions, query, resp, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Skip if value is empty
                        if (!value || lodash_1.isEmpty(value)) {
                            return [2 /*return*/, true];
                        }
                        // Skip if we're not async-capable
                        if (!async) {
                            return [2 /*return*/, true];
                        }
                        schema = this.component.component;
                        requestOptions = {
                            url: this.settings.url,
                            method: 'GET',
                            qs: {},
                            json: true,
                            headers: {}
                        };
                        // If the url is a boolean value
                        if (lodash_1.isBoolean(requestOptions.url)) {
                            requestOptions.url = !!requestOptions.url;
                            if (!requestOptions.url ||
                                schema.dataSrc !== 'url' ||
                                !schema.data.url ||
                                !schema.searchField) {
                                return [2 /*return*/, true];
                            }
                            // Get the validation url
                            requestOptions.url = schema.data.url;
                            // Add the search field
                            requestOptions.qs[schema.searchField] = value;
                            // Add the filters
                            if (schema.filter) {
                                requestOptions.url += (!requestOptions.url.includes('?') ? '?' : '&') + schema.filter;
                            }
                            // If they only wish to return certain fields.
                            if (schema.selectFields) {
                                requestOptions.qs.select = schema.selectFields;
                            }
                        }
                        if (!requestOptions.url) {
                            return [2 /*return*/, true];
                        }
                        // Make sure to interpolate.
                        requestOptions.url = Evaluator_1.Evaluator.interpolate(requestOptions.url, { data: this.component.data });
                        query = [];
                        lodash_1.each(requestOptions.qs, function (val, key) {
                            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                        });
                        requestOptions.url += (requestOptions.url.includes('?') ? '&' : '?') + query.join('&');
                        // Set custom headers.
                        if (schema.data && schema.data.headers) {
                            lodash_1.each(schema.data.headers, function (header) {
                                if (header.key) {
                                    requestOptions.headers[header.key] = header.value;
                                }
                            });
                        }
                        // Set form.io authentication.
                        if (schema.authenticate && this.config.token) {
                            requestOptions.headers['x-jwt-token'] = this.config.token;
                        }
                        return [4 /*yield*/, fetch(new Request(requestOptions.url, {
                                headers: new Headers(requestOptions.headers)
                            }))];
                    case 1:
                        resp = _a.sent();
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        results = _a.sent();
                        return [2 /*return*/, results && results.length];
                }
            });
        });
    };
    return SelectRule;
}(Rule_1.Rule));
exports.SelectRule = SelectRule;
;
