export default {
    type: 'input',
    extends: 'html',
    schema: {
        tag: 'input',
        ref: 'input',
        changeEvent: 'input',
        inputType: 'text'
    },
    methods: {
        getAttributes(_super: any) {
            const inputName = `${this.component.type}-${this.component.key}`.toLowerCase().replace(/[^a-z0-9\-]+/g, '_');
            return ` type="${(this as any).component.inputType}" id="${inputName}" name="${inputName}"${_super.call(this)}`;
        },
        onInput() {
            this.updateValue(this.element.value);
        },
        async attach(_super: any, element: HTMLElement) {
            return _super.call(this, element).then(() => {
                this.addEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
                return this;
            });
        },
        detach(_super: any) {
            this.removeEventListener(this.element, this.component.changeEvent, this.onInput.bind(this));
            _super.call(this);
        },
        setValue(_super: any, value: any) {
            if (this.element) {
                this.element.value = value;
            }
            return _super.call(this, value);
        }
    }
}