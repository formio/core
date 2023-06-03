"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValueComponent = void 0;
const base_1 = require("../../base");
const html_1 = require("../html/html");
let DataValueComponent = exports.DataValueComponent = class DataValueComponent extends html_1.HTML {
};
exports.DataValueComponent = DataValueComponent = __decorate([
    (0, base_1.Component)({
        type: 'datavalue',
        schema: {
            tag: 'span',
            attrs: [],
            className: ''
        },
        template: (ctx) => {
            return `<${ctx.tag} ref="val"${ctx.attrs}>${ctx.value()}</${ctx.tag}>`;
        }
    })
], DataValueComponent);
