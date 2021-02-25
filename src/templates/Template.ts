export class Template {
    constructor(public templates: any) {}
    render(name: any, ctx: any, mode: string = 'html') {
        if (this.templates[name] && this.templates[name][mode]) {
            return this.templates[name][mode](ctx);
        }
        if (typeof name === 'function') {
            return name(ctx);
        }
        return 'Unknown template';
    }
}