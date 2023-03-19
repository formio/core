"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectRule = void 0;
const utils_1 = require("../../utils");
const lodash_1 = require("@formio/lodash");
const fetch_ponyfill_1 = __importDefault(require("fetch-ponyfill"));
const { fetch, Headers, Request } = (0, fetch_ponyfill_1.default)();
const Rule_1 = require("./Rule");
class SelectRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} contains an invalid selection';
    }
    check(value = this.component.dataValue, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Skip if value is empty
            if (!value || (0, lodash_1.isEmpty)(value)) {
                return true;
            }
            // Skip if no url provided.
            if (!this.settings) {
                return true;
            }
            const schema = this.component.component;
            // Initialize the request options
            const requestOptions = {
                url: this.settings,
                method: 'GET',
                qs: {},
                json: true,
                headers: {}
            };
            // If the url is a boolean value
            if ((0, lodash_1.isBoolean)(requestOptions.url)) {
                requestOptions.url = !!requestOptions.url;
                if (!requestOptions.url ||
                    schema.dataSrc !== 'url' ||
                    !schema.data.url ||
                    !schema.searchField) {
                    return true;
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
                return true;
            }
            // Make sure to interpolate.
            requestOptions.url = utils_1.Evaluator.interpolate(requestOptions.url, { data: this.component.data });
            // Add query string to URL
            const query = [];
            (0, lodash_1.each)(requestOptions.qs, (val, key) => {
                query.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            });
            requestOptions.url += (requestOptions.url.includes('?') ? '&' : '?') + query.join('&');
            // Set custom headers.
            if (schema.data && schema.data.headers) {
                (0, lodash_1.each)(schema.data.headers, (header) => {
                    if (header.key) {
                        requestOptions.headers[header.key] = header.value;
                    }
                });
            }
            // Set form.io authentication.
            if (schema.authenticate && options.token) {
                requestOptions.headers['x-jwt-token'] = options.token;
            }
            const resp = yield fetch(new Request(requestOptions.url, {
                headers: new Headers(requestOptions.headers)
            }));
            const results = yield resp.json();
            return results && results.length;
        });
    }
}
exports.SelectRule = SelectRule;
;
