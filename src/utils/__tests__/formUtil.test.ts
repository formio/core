import { expect } from "chai";

import { getContextualRowData, eachComponentDataAsync } from "../formUtil";

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
