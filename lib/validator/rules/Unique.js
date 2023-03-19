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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueRule = void 0;
const utils_1 = require("../../utils");
const lodash_1 = require("@formio/lodash");
const Rule_1 = require("./Rule");
class UniqueRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} must be unique';
    }
    check(value = this.component.dataValue, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // Skip if value is empty object or falsy
            if (!value || (0, lodash_1.isObjectLike)(value) && (0, lodash_1.isEmpty)(value)) {
                return true;
            }
            // Get the options for this check.
            const { form, submission, db } = options;
            // Skip if we don't have a database connection
            if (!db) {
                return true;
            }
            const path = `data.${this.component.path}`;
            // Build the query
            const query = { form: form._id };
            if ((0, lodash_1.isString)(value)) {
                query[path] = {
                    $regex: new RegExp(`^${(0, utils_1.escapeRegExCharacters)(value)}$`),
                    $options: 'i'
                };
            }
            else if ((0, lodash_1.isPlainObject)(value) &&
                value.address &&
                value.address['address_components'] &&
                value.address['place_id']) {
                query[`${path}.address.place_id`] = {
                    $regex: new RegExp(`^${(0, utils_1.escapeRegExCharacters)(value.address['place_id'])}$`),
                    $options: 'i'
                };
            }
            // Compare the contents of arrays vs the order.
            else if ((0, lodash_1.isArray)(value)) {
                query[path] = { $all: value };
            }
            else if ((0, lodash_1.isObject)(value) || (0, lodash_1.isNumber)(value)) {
                query[path] = { $eq: value };
            }
            // Only search for non-deleted items
            query.deleted = { $eq: null };
            const result = yield db.findOne(query);
            return submission._id && (result._id.toString() === submission._id);
        });
    }
}
exports.UniqueRule = UniqueRule;
;
