export class InstanceProxy {
    #instance: any;
    static #FormProxy: any;
    constructor(instance: any) {
        this.#instance = instance;
    }

    static set FormProxy(value: any) {
        InstanceProxy.#FormProxy = value;
    }

    get component() {
        return JSON.parse(JSON.stringify(this.#instance.component));
    }

    get schema() {
        return JSON.parse(JSON.stringify(this.#instance.schema));
    }

    get options() {
        return JSON.parse(JSON.stringify(this.#instance.options));
    }

    on(event: string, callback: Function) {
        this.#instance.on(event, (result: any) => callback(JSON.parse(JSON.stringify(result))));
    }

    get currentForm() {
        return new InstanceProxy.#FormProxy(this.#instance.currentForm);
    }

    get data() {
        return JSON.parse(JSON.stringify(this.#instance.data));
    }

    set data(value: any) {
        this.#instance.data = JSON.parse(JSON.stringify(value));
    }

    get root() {
        return new InstanceProxy.#FormProxy(this.#instance.root);
    }

    get parent() {
        return new InstanceProxy(this.#instance.parent);
    }

    get dataValue() {
        return JSON.parse(JSON.stringify(this.#instance.dataValue));
    }

    set dataValue(value: any) {
        this.#instance.dataValue = JSON.parse(JSON.stringify(value));
    }

    setValue(...args: any[]) {
        args = args.map((arg) => JSON.parse(JSON.stringify(arg)));
        return this.#instance.setValue(...args);
    }

    getValue() {
        return JSON.parse(JSON.stringify(this.#instance.getValue()));
    }

    evalContext(additional: any) {
        return JSON.parse(JSON.stringify(this.#instance.evalContext(additional)));
    }

    // Do nothing functions.
    off() {}
    render() { return ''; }
    redraw() {}
    ready() { return Promise.resolve(); }
    init() {}
    destroy() {}
    teardown() {}
    attach() {}
    detach() {}
    build() {}
    t(text: string) { return text; }
    sanitize(dirty: string) { return dirty; }
    renderString(template: string) { return template; }
}