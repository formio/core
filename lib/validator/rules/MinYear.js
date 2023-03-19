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
exports.MinYearRule = void 0;
const Rule_1 = require("./Rule");
class MinYearRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} should not contain year less than {{ settings }}';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const minYear = this.settings;
            let year = /\d{4}$/.exec(value);
            year = year ? year[0] : null;
            if (!year || !(+minYear) || !(+year)) {
                return true;
            }
            return +year >= +minYear;
        });
    }
}
exports.MinYearRule = MinYearRule;
;
