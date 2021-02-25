"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    tag: 'div',
    className: 'testing',
    attrs: [
        { attr: 'one', value: 'two' },
        { attr: 'three', value: 'four' }
    ],
    components: [
        {
            type: 'html',
            tag: 'span',
            content: 'Testing'
        }
    ]
};
