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
exports.NestedComponent = void 0;
const Components_1 = require("../Components");
const Component_1 = require("../component/Component");
const model_1 = require("../../model");
function NestedComponent(props = {}) {
    if (!props.type) {
        props.type = 'nested';
    }
    if (!props.model) {
        props.model = model_1.NestedModel;
    }
    if (!props.factory) {
        props.factory = Components_1.Components;
    }
    return function (BaseClass) {
        return class ExtendedNestedComponent extends (0, Component_1.Component)(props)(BaseClass) {
            get defaultTemplate() {
                return (ctx) => `<div ref="nested">${ctx.instance.renderComponents()}</div>`;
            }
            /**
             * Attach a html element to this nestd component.
             * @param element
             */
            attach(element) {
                const _super = Object.create(null, {
                    attach: { get: () => super.attach }
                });
                return __awaiter(this, void 0, void 0, function* () {
                    yield _super.attach.call(this, element);
                    if (this.element) {
                        const promises = [];
                        const children = this.element.querySelectorAll(`[data-within="${this.id}"]`);
                        Array.prototype.slice.call(children).forEach((child, index) => {
                            promises.push(this.components[index].attach(child));
                        });
                        yield Promise.all(promises);
                    }
                    return this;
                });
            }
            /**
             * Detach components.
             */
            detach() {
                super.detach();
                this.eachComponent((comp) => comp.detach());
            }
            renderComponents() {
                return this.components.reduce((tpl, comp) => {
                    return tpl + comp.render().replace(/(<[^\>]+)/, `$1 data-within="${this.id}"`);
                }, '');
            }
        };
    };
}
exports.NestedComponent = NestedComponent;
Components_1.Components.addDecorator(NestedComponent, 'nested');
Components_1.Components.addComponent(NestedComponent()(), 'nested');
