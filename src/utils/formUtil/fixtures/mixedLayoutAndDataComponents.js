export default [
  {
    label: 'HTML',
    tag: 'p',
    content: '',
    key: 'html',
    type: 'htmlelement',
    input: false,
  },
  {
    html: '<p>some text</p>',
    label: 'Content',
    key: 'content',
    type: 'content',
    input: false,
  },
  {
    label: 'Text Field',
    key: 'textField',
    type: 'textfield',
    input: true,
  },
  {
    label: 'Number',
    key: 'number',
    type: 'number',
    input: true,
  },
];
