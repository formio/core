import * as fs from 'fs';
import get from "lodash/get";
import { expect } from "chai";
import { Component, HasChildComponents, NestedComponent, TableComponent } from "types";
const writtenNumber = require('written-number');
const components = JSON.parse(fs.readFileSync(__dirname + '/fixtures/components.json').toString());
const components2 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/components2.json').toString());
const components3 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/components3.json').toString());
const components4 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/components4.json').toString());
const components5 = JSON.parse(fs.readFileSync(__dirname + '/fixtures/components5.json').toString());
import {
    getContextualRowData,
    eachComponentDataAsync,
    isComponentDataEmpty,
    eachComponent,
    eachComponentData,
    isLayoutComponent,
    findComponent,
    findComponents,
    getComponent,
    flattenComponents,
    getComponentActualValue,
    hasCondition,
    getModelType
} from "../formUtil";

describe('eachComponent', () => {
    it('should iterate through nested components in the right order', () => {
      let n = 1;
      eachComponent(components, (component: Component) => {
        expect((component as any).order).to.equal(n);
        n += 1;
      });
    });

    it('should include layouts components if provided', () => {
      let numComps = 0;
      let numLayout = 0;
      eachComponent(components, (component: Component) => {
        if (isLayoutComponent(component)) {
          numLayout++;
        }
        else {
          numComps++;
        }
      }, true);
      expect(numLayout).to.be.equal(3);
      expect(numComps).to.be.equal(8);
    });

    it('Should provide the paths to all of the components', () => {
      const paths = [
        'one',
        'parent1',
        'two',
        'parent2',
        'three',
        '',
        'four',
        'five',
        'six',
        'seven',
        'eight'
      ];
      const testPaths: string[] = [];
      eachComponent(components, (component: Component, path: string) => {
        testPaths.push(path);
      }, true);
      expect(paths).to.deep.equal(testPaths);
    });

    describe('findComponent', () => {
      it('should find correct component in nested structure', () => {
        findComponent(components4, 'four', null, (component: Component) => {
          expect(component.label).to.equal('4');
        });
      });
      it('should find correct component in flat structure', () => {
        findComponent(components4, 'one', null, (component: Component) => {
          expect(component.label).to.equal('1');
        });
      });
    });

    it('Should be able to find all textfield components', () => {
      const comps = findComponents(components, { type: 'textfield' });
      expect(comps.length).to.equal(6);
    });

    it('Should be able to find components with special properties.', () => {
      const comps = findComponents(components3, { 'properties.path': 'a' });
      expect(comps.length).to.equal(4);
      expect(comps[0].key).to.equal('b');
      expect(comps[1].key).to.equal('e');
      expect(comps[2].key).to.equal('j');
      expect(comps[3].key).to.equal('m');
    });

    it('Should be able to generate paths based on component types', () => {
      const paths = [
        'a',
        'b',
        'c',
        'd',
        'f',
        'f.g',
        'f.h',
        'f.i',
        'e',
        'j',
        'k',
        'k.n',
        'k.n.o',
        'k.n.p',
        'k.n.q',
        'k.m',
        'k.l',
        'r',
        'submit',
        'tagpad',
        'tagpad.a',
      ];
      const testPaths: string[] = [];
      eachComponent(components2, (component: Component, path: string) => {
        testPaths.push(path);
      }, true);
      expect(paths).to.deep.equal(testPaths);
    });

    it('Should still provide the correct paths when it is not recursive', () => {
      const paths = [
        'a',
        'd',
        'f',
        'f.g',
        'f.h',
        'f.i',
        'e',
        'j',
        'k',
        'k.n',
        'k.n.o',
        'k.n.p',
        'k.n.q',
        'k.m',
        'k.l',
        'r',
        'submit',
        'tagpad',
        'tagpad.a',
      ];
      const testPaths: string[] = [];
      eachComponent(components2, (component: Component, path: string) => {
        testPaths.push(path);
      });
      expect(paths).to.deep.equal(testPaths);
    });

    it('should be able to block recursion', () => {
      let numComps = 0;
      let numLayout = 0;
      eachComponent(components, (component: Component) => {
        if (isLayoutComponent(component)) {
          numLayout++;
        }
        else {
          numComps++;
        }

        if (component.type === 'table') {
          let numInTable = 0;
          const tableComponent: TableComponent = component as TableComponent;
          tableComponent.rows.forEach((row: Component[]) => {
            row.forEach((comp: Component) => {
                eachComponent((comp as HasChildComponents).components, () => {
                    numInTable++;
                });
            });
          });
          expect(numInTable).to.be.equal(4);
          return true;
        }
      }, true);
      expect(numLayout).to.be.equal(3);
      expect(numComps).to.be.equal(4);
    });

    it('should not include `htmlelement` components when `includeAll` is not provided', () => {
      let htmlComponentsAmount = 0;
      eachComponent(components5, (component: Component) => {
        if (component.type === 'htmlelement') {
          htmlComponentsAmount++;
        }
      });
      expect(htmlComponentsAmount).to.be.equal(0);
    });

    it('should include `htmlelement` components when `includeAll` is provided', () => {
      let htmlComponentsAmount = 0;
      eachComponent(components5, (component: Component) => {
        if (component.type === 'htmlelement') {
          htmlComponentsAmount++;
        }
      }, true);
      expect(htmlComponentsAmount).to.be.equal(1);
    });

    it('should not include `content` components when `includeAll` is not provided', () => {
      let contentComponentsAmount = 0;
      eachComponent(components5, (component: Component) => {
        if (component.type === 'content') {
          contentComponentsAmount++;
        }
      });
      expect(contentComponentsAmount).to.be.equal(0);
    });

    it('should include `content` components when `includeAll` is provided', () => {
      let contentComponentsAmount = 0;
      eachComponent(components5, (component: Component) => {
        if (component.type === 'content') {
          contentComponentsAmount++;
        }
      }, true);
      expect(contentComponentsAmount).to.be.equal(1);
    });
  });

describe('getComponent', () => {
it('should return the correct components', () => {
    for (let n = 1; n <= 8; n += 1) {
    const component = getComponent(components, writtenNumber(n));
    expect(component).not.to.be.null;
    expect(component).not.to.be.undefined;
    expect(component).to.be.an('object');
    expect((component as any).order).to.equal(n);
    expect(component?.key).to.equal(writtenNumber(n));
    }
});

it('should work with a different this context', () => {
    for (let n = 1; n <= 8; n += 1) {
    const component = getComponent.call({}, components, writtenNumber(n));
    expect(component).not.to.be.null;
    expect(component).not.to.be.undefined;
    expect(component).to.be.an('object');
    expect((component as any).order).to.equal(n);
    expect(component?.key).to.equal(writtenNumber(n));
    }
});
});

describe('flattenComponents', () => {
it('should return an object of flattened components', () => {
    const flattened = flattenComponents(components);
    for (let n = 1; n <= 8; n += 1) {
    const component = flattened[writtenNumber(n)];
    expect(component).not.to.be.undefined;
    expect(component).to.be.an('object');
    expect((component as any).order).to.equal(n);
    expect(component.key).to.equal(writtenNumber(n));
    }
});

it('should work with a different this context', () => {
    const flattened = flattenComponents.call({}, components);
    for (let n = 1; n <= 8; n += 1) {
    const component = flattened[writtenNumber(n)];
    expect(component).not.to.be.undefined;
    expect(component).to.be.an('object');
    expect(component.order).to.equal(n);
    expect(component.key).to.equal(writtenNumber(n));
    }
});
});

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
    it('Should iterate over each component and data given a flat components array', async () => {
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
        await eachComponentDataAsync(components, data, async (component, data, row, path) => {
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

    it('Should iterate over each component and data given a container component and a nested components array', async () => {
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
        await eachComponentDataAsync(components, data, async (component, data, row, path) => {
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

    it('Should iterate over each component and data given a datagrid component and a nested components array', async () => {
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
        await eachComponentDataAsync(components, data, async (component, data, row, path) => {
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
                        rowIndex: 0,
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        rowIndex: 0,
                        input: true,
                    },
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        rowIndex: 1,
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        rowIndex: 1,
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
                rowIndex: 0,
                input: true,
            },
            'world'
        ]);
    });

    it('Should iterate over a components array and include components that are not in the data object if the includeAll flag is set to true', async () => {
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
        };
        const rowResults: Map<string, [Component, unknown]> = new Map();
        await eachComponentDataAsync(components, data, async (component, data, row, path) => {
            const value = get(data, path);
            rowResults.set(path, [component, value]);
        }, undefined, undefined, undefined, true);
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
            undefined
        ]);
    });

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
        expect(rowResults.get('dataGrid.nestedTextField')).to.deep.equal({
            type: 'textfield',
            key: 'nestedTextField',
            input: true,
        });
        expect(rowResults.get('dataGrid.nestedTextArea')).to.deep.equal({
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
        }, true, 'dataGrid');
        expect(rowResults.size).to.equal(2);
        expect(rowResults.get('dataGrid.nestedTextField')).to.deep.equal({
            type: 'textfield',
            key: 'nestedTextField',
            input: true,
        });
        expect(rowResults.get('dataGrid.nestedTextArea')).to.deep.equal({
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
                        rowIndex: 0,
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        rowIndex: 0,
                        input: true,
                    },
                    {
                        type: 'textfield',
                        key: 'nestedTextField',
                        label: 'Nested Text Field',
                        rowIndex: 1,
                        input: true,
                    },
                    {
                        type: 'textarea',
                        key: 'nestedTextArea',
                        label: 'Nested Text Area',
                        rowIndex: 1,
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
                rowIndex: 0,
                input: true,
            },
            'world'
        ]);
    });

    it('Should iterate over a components array and include components that are not in the data object if the includeAll flag is set to true', () => {
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
        };
        const rowResults: Map<string, [Component, unknown]> = new Map();
        eachComponentData(components, data, (component, data, row, path) => {
            const value = get(data, path);
            rowResults.set(path, [component, value]);
        }, undefined, undefined, undefined, true);
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
            undefined
        ]);
    });
});

describe('getComponentActualValue', () => {
    it('Should return correct value for component inside inside panel inside editGrid', () => {
      const component = {
        label: 'Radio',
        optionsLabelPosition: 'right',
        inline: false,
        tableView: false,
        values: [
          { label: 'yes', value: 'yes', shortcut: '' },
          { label: 'no', value: 'no', shortcut: '' },
        ],
        key: 'radio',
        type: 'radio',
        input: true,
        path: 'editGrid.radio',
        parent: {
          collapsible: false,
          key: 'panel',
          type: 'panel',
          label: 'Panel',
          input: false,
          tableView: false,
          path: 'editGrid[0].panel',
          parent: {
            label: 'Edit Grid',
            tableView: false,
            rowDrafts: false,
            key: 'editGrid',
            type: 'editgrid',
            path: 'editGrid',
            displayAsTable: false,
            input: true,
          },
        },
      };
      const compPath = 'editGrid.radio';
      const data = {
        editGrid: [{ radio: 'yes', textArea: 'test' }],
        submit: true,
      };
      const row = { radio: 'yes', textArea: 'test' };

      const value = getComponentActualValue(component, compPath, data, row);
      expect(value).to.equal('yes');
    });
});

describe('hasCondition', () => {
    it('Should return false if conditions is saved in invalid state', () => {
        const component = {
            label: 'Text Field',
            hidden: true,
            key: 'textField',
            conditional: {
              conjunction: 'all'
            },
            type: 'textfield',
            input: true
        }

        const result = hasCondition(component as Component);
        expect(result).to.equal(false);
    })
});

describe('getModelType', () => {
    it('Should return the correct model type for a component', () => {
        const component = {
            type: 'textfield',
            input: true,
            key: 'textField',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a number input type', () => {
        const component = {
            type: 'number',
            input: true,
            key: 'number',
        };
        const actual = getModelType(component);
        const expected = 'number';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a boolean input type', () => {
        const component = {
            type: 'checkbox',
            input: true,
            key: 'checkbox',
        };
        const actual = getModelType(component);
        const expected = 'boolean';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a datetime input type', () => {
        const component = {
            type: 'datetime',
            input: true,
            key: 'datetime',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a date input type', () => {
        const component = {
            type: 'datetime',
            input: true,
            key: 'date',
            format: 'yyyy-MM-dd',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a time input type', () => {
        const component = {
            type: 'datetime',
            input: true,
            key: 'time',
            format: 'HH:mm:ss',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a currency input type', () => {
        const component = {
            type: 'currency',
            input: true,
            key: 'currency',
        };
        const actual = getModelType(component);
        const expected = 'number';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a email input type', () => {
        const component = {
            type: 'email',
            input: true,
            key: 'email',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a phoneNumber input type', () => {
        const component = {
            type: 'phoneNumber',
            input: true,
            key: 'phoneNumber',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a url input type', () => {
        const component = {
            type: 'url',
            input: true,
            key: 'url',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a textarea input type', () => {
        const component = {
            type: 'textarea',
            input: true,
            key: 'textarea',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a signature input type', () => {
        const component = {
            type: 'signature',
            input: true,
            key: 'signature',
        };
        const actual = getModelType(component);
        const expected = 'string';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a select input type', () => {
        const component = {
            type: 'select',
            input: true,
            key: 'select',
            data: {
                values: [
                    { label: 'foo', value: 'foo' },
                    { label: 'bar', value: 'bar' },
                ],
            },
        };
        const actual = getModelType(component);
        const expected = 'any';
        expect(actual).to.equal(expected);
    });

    it('Should return the correct model type for a component with a selectboxes input type', () => {
        const component = {
            type: 'selectboxes',
            input: true,
            key: 'selectboxes',
            data: {
                values: [
                    { label: 'foo', value: 'foo' },
                    { label: 'bar', value: 'bar' },
                ],
            },
        };
        const actual = getModelType(component);
        const expected = 'any';
        expect(actual).to.equal(expected);
    });
});
