"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLContainerComponent = exports.HTMLContainer = void 0;
const base_1 = require("../../base");
const html_1 = require("../html/html");
/**
 * Base HTMLContainer component.
 */
class HTMLContainer extends html_1.HTML {
    renderContext(extend = {}) {
        return super.renderContext(Object.assign({
            content: this.renderComponents()
        }, extend));
    }
}
exports.HTMLContainer = HTMLContainer;
let HTMLContainerComponent = exports.HTMLContainerComponent = class HTMLContainerComponent extends HTMLContainer {
};
exports.HTMLContainerComponent = HTMLContainerComponent = __decorate([
    (0, base_1.NestedComponent)({
        type: 'htmlcontainer',
        schema: html_1.HTMLProperties.schema,
        template: html_1.HTMLProperties.template
    })
], HTMLContainerComponent);
