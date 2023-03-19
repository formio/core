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
exports.JSONRule = void 0;
const validator_1 = require("../../../validator");
class JSONRule extends validator_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{error}}';
    }
    check(value = this.component.dataValue, data = {}, row = {}, index = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            const { json } = this.settings;
            if (!json) {
                return true;
            }
            const valid = this.component.evaluate(json, {
                data,
                row,
                rowIndex: index,
                input: value
            });
            if (valid === null) {
                return true;
            }
            return valid;
        });
    }
}
exports.JSONRule = JSONRule;
;
