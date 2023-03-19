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
exports.MaxLengthRule = void 0;
const Rule_1 = require("./Rule");
class MaxLengthRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} must have no more than {{ settings }} characters.';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxLength = parseInt(this.settings, 10);
            if (!value || !maxLength || !value.hasOwnProperty('length')) {
                return true;
            }
            return (value.length <= maxLength);
        });
    }
}
exports.MaxLengthRule = MaxLengthRule;
;
