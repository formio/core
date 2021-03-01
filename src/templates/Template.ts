export class Template {
    constructor(public templates: any) {}
    render(name: any, ctx: any, mode: string = 'html') {
        if (typeof name === 'function') {
            return name(ctx);
        }
        if (this.templates[name] && this.templates[name][mode]) {
            return this.templates[name][mode](ctx);
        }
        return 'Unknown template';
    }
}