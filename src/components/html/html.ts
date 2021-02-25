export default {
    type: 'html',
    extends: 'component',
    schema: {
        tag: 'span',
        content: '',
        attrs: [],
        className: ''
    },
    template: (ctx: any) => {
        return `<${ctx.tag} ref="html"${ctx.attrs}>${ctx.t(ctx.content)}</${ctx.tag}>`;
    },
    methods: {
        getAttributes() {
            let hasClass = false;
            let attrs = '';
            for (let i in this.component.attrs) {
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
        },
        renderContext(_super: any): any {
            return _super({
                tag: this.component.tag,
                content: this.component.content ? this.interpolate(this.component.content, this.evalContext()) : '',
                attrs: this.getAttributes(this)
            });
        }
    }
}