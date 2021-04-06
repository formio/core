import { Components } from '../../core/Components';
import { HTMLComponentBase } from '../html/html';
export class DataValueComponent extends HTMLComponentBase({
    type: 'datavalue',
    template: (ctx: any) => {
        return `<${ctx.tag} ref="val"${ctx.attrs}>${ctx.value()}</${ctx.tag}>`;
    }
}) {}
Components.addComponent(DataValueComponent);