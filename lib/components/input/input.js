"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.InputComponent = exports.Input = void 0;
const base_1 = require("../../base");
const html_1 = require("../html/html");
/**
 * Base Input component for extending purposes.
 */
class Input extends html_1.HTML {
    getAttributes() {
        const attributes = super.getAttributes();
        const inputName = `${this.component.type}-${this.component.key}`.toLowerCase().replace(/[^a-z0-9\-]+/g, '_');
        return ` type="${this.component.inputType}" id="${inputName}" name="${inputName}"${attributes}`;
    }
    onInput() {
        this.updateValue(this.element.value);
    }
    attach(element) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
            return this;
        });
    }
    detach() {
        this.removeEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
    }
    setValue(value) {
        if (this.element) {
            this.element.value = value;
        }
    }
}
exports.Input = Input;
let InputComponent = exports.InputComponent = class InputComponent extends Input {
};
exports.InputComponent = InputComponent = __decorate([
    (0, base_1.Component)({
        type: 'input',
        template: html_1.HTMLProperties.template,
        schema: Object.assign(Object.assign({}, html_1.HTMLProperties.schema), {
            tag: 'input',
            ref: 'input',
            changeEvent: 'input',
            inputType: 'text'
        })
    })
], InputComponent);
