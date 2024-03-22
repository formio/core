import { expect } from "chai";

import { getContextualRowData, eachComponentDataAsync, isComponentDataEmpty } from "../formUtil";

xdescribe('getContextualRowData', () => {
    it('Should return the data at path without the last element given nested containers', () => {
        const data = {
            a: {
                b: {
                    c: 'hello',
                },
            },
        };
        const path = 'a.b.c';
        const actual = getContextualRowData({
           type: 'textfield',
           input: true,
           key: 'c'
        }, path, data);
        const expected = { c: 'hello' };
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path without the last element given nested containers', () => {
        const data = {
            a: {
                b: {
                    c: 'hello',
                },
            },
        };
        const path = 'a.b';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'b'
         }, path, data);
        const expected = { b: { c: 'hello' } };
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path without the last element given nested containers', () => {
        const data = {
            a: {
                b: {
                    c: 'hello',
                },
            },
        };
        const path = 'a';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'a'
         }, path, data);
        const expected = { a: { b: { c: 'hello' } } };
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path without the last element given nested containers', () => {
        const data = {
            a: {
                b: {
                    c: 'hello',
                },
            },
            d: 'there'
        };
        const path = '';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'd'
         }, path, data);
        const expected = { a: { b: { c: 'hello' } }, d: 'there' };
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested arrays', () => {
        const data = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        const path = 'a[0].b';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'b'
         }, path, data);
        const expected = {b: 'hello', c: 'world'};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested arrays', () => {
        const data = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        const path = 'a[1].b';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'b'
         }, path, data);
        const expected = {b: 'foo', c: 'bar'};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested arrays', () => {
        const data = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        const path = 'a';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'a'
         }, path, data);
        const expected = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested arrays', () => {
        const data = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        const path = '';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'a'
         }, path, data);
        const expected = {
            a: [{b: 'hello', c: 'world'}, {b: 'foo', c: 'bar'}],
        }
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested containers and arrays', () => {
        const data = {
            a: {
                b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}],
            },
        }
        const path = 'a.b[0].c';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'c'
         }, path, data);
        const expected = {c: 'hello', d: 'world'};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested containers and arrays', () => {
        const data = {
            a: {
                b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}],
            },
        }
        const path = 'a.b[1].c';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'c'
         }, path, data);
        const expected = {c: 'foo', d: 'bar'};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested containers and arrays', () => {
        const data = {
            a: {
                b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}],
            },
        }
        const path = 'a.b';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'b'
         }, path, data);
        const expected = {b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}]};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested containers and arrays', () => {
        const data = {
            a: {
                b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}],
            },
        }
        const path = 'a';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'a'
         }, path, data);
        const expected = {a: {b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}]}};
        expect(actual).to.deep.equal(expected);
    });

    it('Should return the data at path given nested containers and arrays', () => {
        const data = {
            a: {
                b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}],
            },
        }
        const path = '';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'a'
         }, path, data);
        const expected = {a: {b: [{c: 'hello', d: 'world'}, {c: 'foo', d: 'bar'}]}};
        expect(actual).to.deep.equal(expected);
    });

    it('Should work with a component key that has periods in it', () => {
        const data = {
            a: {
                b: [{c: {e: 'zed'}, d: 'world'}, {c: {e: 'foo'}, d: 'bar'}],
            },
        }
        const path = 'a.b[0].c.e';
        const actual = getContextualRowData({
            type: 'textfield',
            input: true,
            key: 'c.e'
         }, path, data);
        const expected = {c: {e: 'zed'}, d: 'world'};
        expect(actual).to.deep.equal(expected);
    });
});

xdescribe('eachComponentDataAsync', () => {
    describe('Flattened form components (for evaluation)', () => {
        it('Should return the correct contextual row data for each component', async () => {
            const components = [
                {
                    type: 'textfield',
                    key: 'textField',
                    input: true,
                    tableView: true,
                },
                {
                    type: 'datagrid',
                    key: 'dataGrid',
                    input: true,
                    tableView: true,
                },
                {
                    type: 'textfield',
                    key: 'dataGrid[0].nestedTextField',
                    input: true,
                    tableView: true,
                },
                {
                    type: 'editgrid',
                    key: 'dataGrid[0].nestedEditGrid',
                    input: true,
                    tableView: true,
                },
                {
                    type: 'textfield',
                    key: 'dataGrid[0].nestedEditGrid[0].nestedNestedTextField',
                    input: true,
                    tableView: true,
                },
            ];
            const data = {
                textField: 'hello',
                dataGrid: [
                    {
                        nestedTextField: 'world',
                        nestedEditGrid: [
                            {
                                nestedNestedTextField: 'foo',
                            },
                        ],
                    },
                    {
                        nestedTextField: 'bar',
                        nestedEditGrid: [
                            {
                                nestedNestedTextField: 'baz',
                            },
                        ],
                    },
                ],
            };
            const rowResults: Map<string, any> = new Map();
            await eachComponentDataAsync(components, data, async (component, data, row, path) => {
                rowResults.set(path, row);
            });
            console.log(rowResults);
        });
    });

    describe('Normal form components', () => {
        it('Should return the correct contextual row data for each component', async () => {
            const components = [
                {
                    type: 'textfield',
                    key: 'textField',
                    input: true,
                    tableView: true,
                },
                {
                    type: 'datagrid',
                    key: 'dataGrid',
                    input: true,
                    tableView: true,
                    components: [
                        {
                            type: 'textfield',
                            key: 'nestedTextField',
                            input: true,
                            tableView: true,
                        },
                        {
                            type: 'editGrid',
                            key: 'nestedEditGrid',
                            input: true,
                            tableView: true,
                            components: [
                                {
                                    type: 'textfield',
                                    key: 'nestedNestedTextField',
                                    input: true,
                                    tableView: true,
                                },
                            ],
                        }
                    ],
                },
            ];
            const data = {
                textField: 'hello',
                dataGrid: [
                    {
                        nestedTextField: 'world',
                        nestedEditGrid: [
                            {
                                nestedNestedTextField: 'foo',
                            },
                        ],
                    },
                    {
                        nestedTextField: 'bar',
                        nestedEditGrid: [
                            {
                                nestedNestedTextField: 'baz',
                            },
                        ],
                    },
                ],
            };
            const rowResults: Map<string, any> = new Map();
            await eachComponentDataAsync(components, data, async (component, data, row, path) => {
                rowResults.set(path, row);
            });
            console.log(rowResults);
        });
    });
});

describe('isEmpty', () => {
    it('Should return true for an empty object', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const data = {};
        const actual = isComponentDataEmpty(component, data, 'textField');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return false for a non-empty object', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const data = {
            textField: 'hello',
        };
        const actual = isComponentDataEmpty(component, data, 'textField');
        const expected = false;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a checkbox component set to false', () => {
        const component = {
            type: 'checkbox',
            input: true,
            key: 'checkbox',
        };
        const data = {
            checkbox: false,
        };
        const actual = isComponentDataEmpty(component, data, 'checkbox');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return false for a checkbox component set to true', () => {
        const component = {
            type: 'checkbox',
            input: true,
            key: 'checkbox',
        };
        const data = {
            checkbox: true,
        };
        const actual = isComponentDataEmpty(component, data, 'checkbox');
        const expected = false;
        expect(actual).to.equal(expected);
    });

    it('Should return true for an empty dataGrid component', () => {
        const component = {
            type: 'datagrid',
            input: true,
            key: 'dataGrid',
        };
        const data = {
            dataGrid: [],
        };
        const actual = isComponentDataEmpty(component, data, 'dataGrid');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a non-empty dataGrid component with empty child components', () => {
        const component = {
            type: 'datagrid',
            input: true,
            key: 'dataGrid',
            components: [
                {
                    type: 'textfield',
                    input: true,
                    key: 'textField',
                },
                {
                    type: 'checkbox',
                    input: true,
                    key: 'checkbox'
                },
                {
                    type: 'textarea',
                    wysiwyg: true,
                    input: true,
                    key: 'textArea'
                }
            ],
        };
        const data = {
            dataGrid: [
                {
                    textField: '',
                    checkbox: false,
                    textArea: '<p>&nbsp;</p>',
                },
            ],
        };
        const actual = isComponentDataEmpty(component, data, 'dataGrid');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return false for a datagrid with non-empty child components', () => {
        const component = {
            type: 'datagrid',
            input: true,
            key: 'dataGrid',
            components: [
                {
                    type: 'textfield',
                    input: true,
                    key: 'textField',
                },
                {
                    type: 'checkbox',
                    input: true,
                    key: 'checkbox'
                },
                {
                    type: 'textarea',
                    wysiwyg: true,
                    input: true,
                    key: 'textArea'
                }
            ],
        };
        const data = {
            dataGrid: [
                {
                    textField: 'hello',
                    checkbox: true,
                    textArea: '<p>world</p>',
                },
            ],
        };
        const actual = isComponentDataEmpty(component, data, 'dataGrid');
        const expected = false;
        expect(actual).to.equal(expected);
    });

    it('Should return true for an empty Select Boxes component', () => {
        const component = {
            type: 'selectboxes',
            input: true,
            key: 'selectBoxes',
            data: {
                values: [
                    {
                        label: 'foo',
                        value: 'foo',
                    },
                    {
                        label: 'bar',
                        value: 'bar',
                    },
                ],
            },
        };
        const data = {
            selectBoxes: {},
        };
        const actual = isComponentDataEmpty(component, data, 'selectBoxes');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a non-empty Select Boxes component with no selected values', () => {
        const component = {
            type: 'selectboxes',
            input: true,
            key: 'selectBoxes',
            data: {
                values: [
                    {
                        label: 'foo',
                        value: 'foo',
                    },
                    {
                        label: 'bar',
                        value: 'bar',
                    },
                ],
            },
        };
        const data = {
            selectBoxes: {
                foo: false,
                bar: false,
            },
        };
        const actual = isComponentDataEmpty(component, data, 'selectBoxes');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return false for a non-empty Select Boxes component with selected values', () => {
        const component = {
            type: 'selectboxes',
            input: true,
            key: 'selectBoxes',
            data: {
                values: [
                    {
                        label: 'foo',
                        value: 'foo',
                    },
                    {
                        label: 'bar',
                        value: 'bar',
                    },
                ],
            },
        };
        const data = {
            selectBoxes: {
                foo: true,
                bar: false,
            },
        };
        const actual = isComponentDataEmpty(component, data, 'selectBoxes');
        const expected = false;
        expect(actual).to.equal(expected);
    });

    it('Should return true for an empty Select component', () => {
        const component = {
            type: 'select',
            input: true,
            key: 'select',
            data: {
                values: [
                    {
                        label: 'foo',
                        value: 'foo',
                    },
                    {
                        label: 'bar',
                        value: 'bar',
                    },
                ],
            },
        };
        const data = {
            select: '',
        };
        const actual = isComponentDataEmpty(component, data, 'select');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for an empty plain Text Area component', () => {
        const component = {
            type: 'textarea',
            input: true,
            key: 'textArea',
        };
        const data = {
            textArea: '',
        };
        const actual = isComponentDataEmpty(component, data, 'textArea');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a non-empty non-plain Text Area component with only WYSIWYG or editor HTML', () => {
        const component = {
            type: 'textarea',
            input: true,
            key: 'textArea',
            wysiwyg: true
        };
        const data = {
            textArea: '<p>&nbsp;</p>',
        };
        const actual = isComponentDataEmpty(component, data, 'textArea');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a non-empty text area with only whitespace', () => {
        const component = {
            type: 'textarea',
            input: true,
            key: 'textArea',
        };
        const data = {
            textArea: '   ',
        };
        const actual = isComponentDataEmpty(component, data, 'textArea');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return false for a non-empty Text Field', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const data = {
            textField: 'hello',
        };
        const actual = isComponentDataEmpty(component, data, 'textField');
        const expected = false;
        expect(actual).to.equal(expected);
    });

    it('Should return true for an empty Text Field component', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const data = {
            textField: '',
        };
        const actual = isComponentDataEmpty(component, data, 'textField');
        const expected = true;
        expect(actual).to.equal(expected);
    });

    it('Should return true for a non-empty Text Field component with only whitespace', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const data = {
            textField: '   ',
        };
        const actual = isComponentDataEmpty(component, data, 'textField');
        const expected = true;
        expect(actual).to.equal(expected);
    });
});
