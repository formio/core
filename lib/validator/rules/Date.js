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
exports.DateRule = void 0;
const Rule_1 = require("./Rule");
class DateRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} is not a valid date.';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value || value instanceof Date) {
                return true;
            }
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'invalid date') {
                    return false;
                }
                value = new Date(value);
            }
            return value.toString() !== 'Invalid Date';
        });
    }
}
exports.DateRule = DateRule;
;
