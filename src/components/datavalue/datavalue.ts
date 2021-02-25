export default {
    type: 'datavalue',
    extends: 'html',
    template: (ctx: any) => {
        return `<${ctx.tag} ref="val"${ctx.attrs}>${ctx.value()}</${ctx.tag}>`;
    }
}