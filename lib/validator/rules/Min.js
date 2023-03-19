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
exports.MinRule = void 0;
const Rule_1 = require("./Rule");
const lodash_1 = require("@formio/lodash");
class MinRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} cannot be less than {{ settings }}.';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const min = parseFloat(this.settings);
            const parsedValue = parseFloat(value);
            if ((0, lodash_1.isNaN)(min) || (0, lodash_1.isNaN)(parsedValue)) {
                return true;
            }
            return parsedValue >= min;
        });
    }
}
exports.MinRule = MinRule;
;
