import get from "lodash/get";
import { expect } from "chai";
import { Component } from "types";

import {
    getContextualRowData,
    eachComponentDataAsync,
    isComponentDataEmpty,
    eachComponent,
    eachComponentData
} from "../formUtil";

describe('getContextualRowData', () => {
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

describe('eachComponentDataAsync', () => {
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

describe('isComponentDataEmpty', () => {
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

describe('eachComponent', () => {
    it('Should iterate over each component given a flat components array', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
            },
            {
                type: 'textarea',
                key: 'textArea',
                input: true,
            }
        ];
        const rowResults: Map<string, any> = new Map();
        eachComponent(components, (component: Component, path: string) => {
            rowResults.set(path, component);
        });
        expect(rowResults.size).to.equal(2);
        expect(rowResults.get('textField')).to.deep.equal({
            type: 'textfield',
            key: 'textField',
            input: true,
        });
        expect(rowResults.get('textArea')).to.deep.equal({
            type: 'textarea',
            key: 'textArea',
            input: true,
        });
    });

    it('Should iterate over each component with correct pathing given a container component', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
            },
            {
                type: 'container',
                key: 'container',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        input: true,
                    }
                ]
            }
        ];
        const rowResults: Map<string, any> = new Map();
        eachComponent(components, (component: Component, path: string) => {
            rowResults.set(path, component);
        }, true);
        expect(rowResults.size).to.equal(4);
        expect(rowResults.get('textField')).to.deep.equal({
            type: 'textfield',
            key: 'textField',
            input: true,
        });
        expect(rowResults.get('container')).to.deep.equal({
            type: 'container',
            key: 'container',
            input: true,
            components: [
                {
                    type: 'textfield',
                    key: 'nestedTextField',
                    input: true,
                },
                {
                    type: 'textarea',
                    key: 'nestedTextArea',
                    input: true,
                }
            ]
        });
        expect(rowResults.get('container.nestedTextField')).to.deep.equal({
            type: 'textfield',
            key: 'nestedTextField',
            input: true,
        });
        expect(rowResults.get('container.nestedTextArea')).to.deep.equal({
            type: 'textarea',
            key: 'nestedTextArea',
            input: true,
        });
    });

    it('Should iterate over each component with correct pathing given a datagrid component', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                input: true,
            },
            {
                type: 'datagrid',
                key: 'dataGrid',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        input: true,
                    }
                ]
            }
        ];
        const rowResults: Map<string, any> = new Map();
        eachComponent(components, (component: Component, path: string) => {
            rowResults.set(path, component);
        }, true);
        expect(rowResults.size).to.equal(4);
        expect(rowResults.get('textField')).to.deep.equal({
            type: 'textfield',
            key: 'textField',
            input: true,
        });
        expect(rowResults.get('dataGrid')).to.deep.equal({
            type: 'datagrid',
            key: 'dataGrid',
            input: true,
            components: [
                {
                    type: 'textfield',
                    key: 'nestedTextField',
                    input: true,
                },
                {
                    type: 'textarea',
                    key: 'nestedTextArea',
                    input: true,
                }
            ]
        });
        expect(rowResults.get('dataGrid[0].nestedTextField')).to.deep.equal({
            type: 'textfield',
            key: 'nestedTextField',
            input: true,
        });
        expect(rowResults.get('dataGrid[0].nestedTextArea')).to.deep.equal({
            type: 'textarea',
            key: 'nestedTextArea',
            input: true,
        });
    });

    it('Should iterate over each component with correct pathing given a datagrid\'s child components', () => {
        const components = [
            {
                type: 'datagrid',
                key: 'dataGrid',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        input: true,
                    }
                ]
            }
        ];
        const rowResults: Map<string, any> = new Map();
        eachComponent(components[0].components, (component: Component, path: string) => {
            rowResults.set(path, component);
        }, true, 'dataGrid[0]');
        expect(rowResults.size).to.equal(2);
        expect(rowResults.get('dataGrid[0].nestedTextField')).to.deep.equal({
            type: 'textfield',
            key: 'nestedTextField',
            input: true,
        });
        expect(rowResults.get('dataGrid[0].nestedTextArea')).to.deep.equal({
            type: 'textarea',
            key: 'nestedTextArea',
            input: true,
        });
    });
});

describe('eachComponentData', () => {
    it('Should iterate over each component and data given a flat components array', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            {
                type: 'textarea',
                key: 'textArea',
                label: 'Text Area',
                input: true,
            }
        ];
        const data = {
            textField: 'hello',
            textArea: 'world',
        };
        const rowResults: Map<string, any> = new Map();
        eachComponentData(components, data, (component, data, row, path) => {
            const value = get(data, path);
            rowResults.set(path, [component, value]);
        });
        expect(rowResults.size).to.equal(2);
        expect(rowResults.get('textField')).to.deep.equal([
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            'hello'
        ]);
        expect(rowResults.get('textArea')).to.deep.equal([
            {
                type: 'textarea',
                key: 'textArea',
                label: 'Text Area',
                input: true,
            },
            'world'
        ]);
    });

    it('Should iterate over each component and data given a container component and a nested components array', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            {
                type: 'container',
                key: 'container',
                label: 'Container',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        input: true,
                    }
                ]
            }
        ];
        const data = {
            textField: 'hello',
            container: {
                nestedTextField: 'world',
                nestedTextArea: 'foo',
            },
        };
        const rowResults: Map<string, any> = new Map();
        eachComponentData(components, data, (component, data, row, path) => {
            const value = get(data, path);
            rowResults.set(path, [component, value]);
        });
        expect(rowResults.size).to.equal(4);
        expect(rowResults.get('textField')).to.deep.equal([
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            'hello'
        ]);
        expect(rowResults.get('container')).to.deep.equal([
            {
                type: 'container',
                key: 'container',
                label: 'Container',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        input: true,
                    }
                ]
            },
            {
                nestedTextField: 'world',
                nestedTextArea: 'foo',
            }
        ]);
        expect(rowResults.get('container.nestedTextField')).to.deep.equal([
            {
                type: 'textfield',
                key: 'nestedTextField',
                label: 'Nested Text Field',
                input: true,
            },
            'world'
        ]);
        expect(rowResults.get('container.nestedTextArea')).to.deep.equal([
            {
                type: 'textarea',
                key: 'nestedTextArea',
                label: 'Nested Text Area',
                input: true,
            },
            'foo'
        ]);
    });

    it('Should iterate over each component and data given a datagrid component and a nested components array', () => {
        const components = [
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            {
                type: 'datagrid',
                key: 'dataGrid',
                label: 'Data Grid',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        input: true,
                    }
                ]
            }
        ];
        const data = {
            textField: 'hello',
            dataGrid: [
                {
                    nestedTextField: 'world',
                    nestedTextArea: 'foo',
                },
                {
                    nestedTextField: 'bar',
                    nestedTextArea: 'baz',
                }
            ],
        };
        const rowResults: Map<string, any> = new Map();
        eachComponentData(components, data, (component, data, row, path) => {
            const value = get(data, path);
            rowResults.set(path, [component, value]);
        });
        expect(rowResults.size).to.equal(6);
        expect(rowResults.get('textField')).to.deep.equal([
            {
                type: 'textfield',
                key: 'textField',
                label: 'Text Field',
                input: true,
            },
            'hello'
        ]);
        expect(rowResults.get('dataGrid')).to.deep.equal([
            {
                type: 'datagrid',
                key: 'dataGrid',
                label: 'Data Grid',
                input: true,
                components: [
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        input: true,
                    }
                ]
            },
            [
                {
                    nestedTextField: 'world',
                    nestedTextArea: 'foo',
                },
                {
                    nestedTextField: 'bar',
                    nestedTextArea: 'baz',
                }
            ]
        ]);
        expect(rowResults.get('dataGrid[0].nestedTextField')).to.deep.equal([
            {
                type: 'textfield',
                key: 'nestedTextField',
                label: 'Nested Text Field',
                input: true,
            },
            'world'
        ]);
    });
});
