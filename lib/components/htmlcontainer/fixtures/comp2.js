"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    type: 'htmlcontainer',
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
        },
        {
            type: 'htmlcontainer',
            tag: 'div',
            components: [
                {
                    type: 'html',
                    tag: 'h3',
                    content: '<script>alert("No XSS allowed!!!!");</script>This is a title'
                }
            ]
        }
    ]
};
