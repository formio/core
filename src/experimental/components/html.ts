import { Component } from '../base';
export const HTMLProperties = {
  type: 'html',
  schema: {
    tag: 'span',
    content: '',
    attrs: [],
    className: '',
  },
  template: (ctx: any) => {
    return `<${ctx.tag} ref="${ctx.ref}"${ctx.attrs}>${ctx.t(ctx.content)}</${ctx.tag}>`;
  },
};

/**
 * Base class for HTML based components.
 */
export class HTML {
  [x: string]: any;
  constructor(
    public component?: any,
    public options?: any,
    public data?: any,
  ) {}
  public getAttributes() {
    let hasClass = false;
    let attrs = '';
    for (const i in this.component.attrs) {
      if (this.component.attrs.hasOwnProperty(i)) {
        const attrValue = this.component.attrs[i];
        const isString = Number.isNaN(parseInt(i));
        let attr = isString ? i : attrValue.attr;
        const value = isString ? attrValue : attrValue.value;
        if (attr === 'class' && this.component.className) {
          hasClass = true;
          attr += ` ${this.component.className}`;
        }
        attrs += ` ${attr}="${this.interpolate(value, this.evalContext())}"`;
      }
    }
    if (!hasClass && this.component.className) {
      attrs += ` class="${this.interpolate(this.component.className, this.evalContext())}"`;
    }
    return attrs;
  }

  public renderContext(extend: any = {}): any {
    return Object.assign(
      {
        tag: this.component.tag,
        ref: this.component.type,
        content: this.component.content
          ? this.interpolate(this.component.content, this.evalContext())
          : '',
        attrs: this.getAttributes(),
      },
      extend,
    );
  }
}

@Component(HTMLProperties)
export class HTMLComponent extends HTML {}
