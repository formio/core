import { InstanceProxy } from "./InstanceProxy";
export class FormProxy extends InstanceProxy {
    #instance: any;
    constructor(instance: any) {
        super(instance);
        this.#instance = instance;
    }

    set submission(submission: any) {
        this.#instance.submission = JSON.parse(JSON.stringify(submission));
    }

    setSubmission(...args: any[]) {
        args = args.map((arg) => JSON.parse(JSON.stringify(arg)));
        return this.#instance.setSubmission(...args);
    }

    get submission() {
        return JSON.parse(JSON.stringify(this.#instance.submission));
    }

    set form(form: any) {
        this.#instance.form = JSON.parse(JSON.stringify(form));
    }

    get form() {
        return JSON.parse(JSON.stringify(this.#instance.form));
    }

    getComponent(key: string) {
        return new InstanceProxy(this.#instance.getComponent(key));
    }
}