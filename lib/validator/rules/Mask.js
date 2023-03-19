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
exports.MaskRule = void 0;
const utils_1 = require("../../utils");
const Rule_1 = require("./Rule");
class MaskRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} does not match the mask.';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let inputMask;
            if (this.component.isMultipleMasksField) {
                const maskName = value ? value.maskName : undefined;
                const formioInputMask = this.component.getMaskByName(maskName);
                if (formioInputMask) {
                    inputMask = (0, utils_1.getInputMask)(formioInputMask);
                }
                value = value ? value.value : value;
            }
            else {
                inputMask = (0, utils_1.getInputMask)(this.settings);
            }
            if (value && inputMask) {
                return (0, utils_1.matchInputMask)(value, inputMask);
            }
            return true;
        });
    }
}
exports.MaskRule = MaskRule;
;
