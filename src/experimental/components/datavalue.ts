import { Component } from '../base';
import { HTML } from './html';

@Component({
  type: 'datavalue',
  schema: {
    tag: 'span',
    attrs: [],
    className: '',
  },
  template: (ctx: any) => {
    return `<${ctx.tag} ref="val"${ctx.attrs}>${ctx.value()}</${ctx.tag}>`;
  },
})
export class DataValueComponent extends HTML {}
