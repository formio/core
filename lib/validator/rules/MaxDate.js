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
exports.MaxDateRule = void 0;
const utils_1 = require("../../utils");
const lodash_1 = require("@formio/lodash");
const dayjs_1 = __importDefault(require("dayjs"));
const Rule_1 = require("./Rule");
class MaxDateRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} should not contain date after {{ settings }}';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                return true;
            }
            // If they are the exact same string or object, then return true.
            if (value === this.settings) {
                return true;
            }
            const date = (0, dayjs_1.default)(value);
            const maxDate = (0, utils_1.getDateSetting)(this.settings);
            if ((0, lodash_1.isNull)(maxDate)) {
                return true;
            }
            else {
                maxDate.setHours(0, 0, 0, 0);
            }
            return date.isBefore(maxDate) || date.isSame(maxDate);
        });
    }
}
exports.MaxDateRule = MaxDateRule;
;
