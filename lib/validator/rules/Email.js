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
exports.EmailRule = void 0;
const Rule_1 = require("./Rule");
class EmailRule extends Rule_1.Rule {
    constructor() {
        super(...arguments);
        this.defaultMessage = '{{ field }} must be a valid email.';
    }
    check(value = this.component.dataValue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                return true;
            }
            /* eslint-disable max-len */
            // From http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            /* eslint-enable max-len */
            // Allow emails to be valid if the component is pristine and no value is provided.
            return re.test(value);
        });
    }
}
exports.EmailRule = EmailRule;
;
