import html from '../html/html';
export default {...html, ...{
    type: 'htmlcontainer',
    extends: 'nested',
    methods: {
        ...html.methods,
        ...{
            renderContext(_super:any, extend: any = {}) {
                return html.methods.renderContext.call(this, _super, Object.assign({
                    content: this.renderComponents()
                }, extend));
            }
        }
    }
}};