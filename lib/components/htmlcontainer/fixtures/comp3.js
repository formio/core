"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'htmlcontainer',
    components: [
        {
            type: 'html',
            tag: 'label',
            content: 'First Name',
            attrs: {
                class: 'form-label',
                for: 'input-firstname'
            }
        },
        {
            type: 'input',
            key: 'firstName',
            attrs: {
                class: 'form-control',
                placeholder: 'Enter your first name'
            }
        },
        {
            type: 'html',
            tag: 'label',
            content: 'Last Name',
            attrs: {
                class: 'form-label',
                for: 'input-firstname'
            }
        },
        {
            type: 'input',
            key: 'lastName',
            attrs: {
                class: 'form-control',
                placeholder: 'Enter your last name'
            }
        }
    ]
};
