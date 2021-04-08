import { Component } from '../../core';
import { Components } from '../../core/Components';
import { HTML } from '../html/html';

@Component({
    type: 'datavalue',
    schema: {
        tag: 'span',
        attrs: [],
        className: ''
    },
    template: (ctx: any) => {
        return `<${ctx.tag} ref="val"${ctx.attrs}>${ctx.value()}</${ctx.tag}>`;
    }
})
export class DataValueComponent extends HTML {}
Components.addComponent(DataValueComponent, 'datavalue');