import { expect } from 'chai';
import {
  textFieldsNestedInLayoutComponents,
  nestedArrayDataComponents,
  mixedLayoutAndDataComponents,
} from '../fixtures';

import { eachComponent } from '../eachComponent';
import { isLayoutComponent } from '../index';

import { Component, TableComponent, HasChildComponents } from 'types';

describe('eachComponent', function () {
  it('should iterate through nested components in the right order', function () {
    let n = 1;
    eachComponent(textFieldsNestedInLayoutComponents, (component: Component) => {
      expect((component as any).order).to.equal(n);
      n += 1;
    });
  });

  it('should include layouts components if provided', function () {
    let numComps = 0;
    let numLayout = 0;
    eachComponent(
      textFieldsNestedInLayoutComponents,
      (component: Component) => {
        if (isLayoutComponent(component)) {
          numLayout++;
        } else {
          numComps++;
        }
      },
      true,
    );
    expect(numLayout).to.be.equal(3);
    expect(numComps).to.be.equal(8);
  });

  it('Should provide the paths to all of the components if includeAll=true', function () {
    const paths = [
      'one',
      'parent1',
      'parent1.two',
      'parent1.parent2',
      'parent1.parent2.three',
      'parent1.parent2',
      'parent1.parent2.four',
      'parent1.parent2.five',
      'parent1.parent2.six',
      'parent1.parent2.seven',
      'eight',
    ];
    const testPaths: string[] = [];
    eachComponent(
      textFieldsNestedInLayoutComponents,
      (component: Component, path: string) => {
        testPaths.push(path);
      },
      true,
    );
    expect(paths).to.deep.equal(testPaths);
  });

  it('Should iterate over each component given a flat components array', function () {
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
      },
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

  it('Should iterate over each component with correct pathing given a container component', function () {
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
          },
        ],
      },
    ];
    const rowResults: Map<string, any> = new Map();
    eachComponent(
      components,
      (component: Component, path: string) => {
        rowResults.set(path, component);
      },
      true,
    );
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
        },
      ],
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

  it('Should iterate over each component with correct pathing given a datagrid component', function () {
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
          },
        ],
      },
    ];
    const rowResults: Map<string, any> = new Map();
    eachComponent(
      components,
      (component: Component, path: string) => {
        rowResults.set(path, component);
      },
      true,
    );
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
        },
      ],
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

  it("Should iterate over each component with correct pathing given a datagrid's child components", function () {
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
          },
        ],
      },
    ];
    const rowResults: Map<string, any> = new Map();
    eachComponent(
      components,
      (component: Component, path: string) => {
        rowResults.set(path, component);
      },
      true,
    );
    expect(rowResults.size).to.equal(3);
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

  it('Should be able to generate paths based on component types', function () {
    const paths = [
      'a',
      'b',
      'b.c',
      'b.c.d',
      'b.c.f',
      'b.c.f.g',
      'b.c.f.h',
      'b.c.f.i',
      'b.c.e',
      'b.j',
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
    eachComponent(
      nestedArrayDataComponents,
      (component: Component, path: string) => {
        testPaths.push(path);
      },
      true,
    );
    expect(paths).to.deep.equal(testPaths);
  });

  it('Should still provide the correct paths when it is not recursive', function () {
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
    eachComponent(nestedArrayDataComponents, (component: Component, path: string) => {
      testPaths.push(path);
    });
    expect(paths).to.deep.equal(testPaths);
  });

  it('should be able to block recursion', function () {
    let numComps = 0;
    let numLayout = 0;
    eachComponent(
      textFieldsNestedInLayoutComponents,
      (component: Component) => {
        if (isLayoutComponent(component)) {
          numLayout++;
        } else {
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
      },
      true,
    );
    expect(numLayout).to.be.equal(3);
    expect(numComps).to.be.equal(4);
  });

  it('should not include `htmlelement` components when `includeAll` is not provided', function () {
    let htmlComponentsAmount = 0;
    eachComponent(mixedLayoutAndDataComponents, (component: Component) => {
      if (component.type === 'htmlelement') {
        htmlComponentsAmount++;
      }
    });
    expect(htmlComponentsAmount).to.be.equal(0);
  });

  it('should include `htmlelement` components when `includeAll` is provided', function () {
    let htmlComponentsAmount = 0;
    eachComponent(
      mixedLayoutAndDataComponents,
      (component: Component) => {
        if (component.type === 'htmlelement') {
          htmlComponentsAmount++;
        }
      },
      true,
    );
    expect(htmlComponentsAmount).to.be.equal(1);
  });

  it('should not include `content` components when `includeAll` is not provided', function () {
    let contentComponentsAmount = 0;
    eachComponent(mixedLayoutAndDataComponents, (component: Component) => {
      if (component.type === 'content') {
        contentComponentsAmount++;
      }
    });
    expect(contentComponentsAmount).to.be.equal(0);
  });

  it('should include `content` components when `includeAll` is provided', function () {
    let contentComponentsAmount = 0;
    eachComponent(
      mixedLayoutAndDataComponents,
      (component: Component) => {
        if (component.type === 'content') {
          contentComponentsAmount++;
        }
      },
      true,
    );
    expect(contentComponentsAmount).to.be.equal(1);
  });

  it('Should get the absolute paths correctly when iterating.', function () {
    const form: any = {
      key: 'form',
      display: 'form',
      components: [
        {
          type: 'container',
          key: 'outer-container',
          components: [
            {
              type: 'textfield',
              key: 'textfield',
            },
            {
              type: 'container',
              key: 'inner-container',
              components: [
                {
                  type: 'textfield',
                  key: 'innerTextfield',
                },
              ],
            },
          ],
        },
      ],
    };
    // when passed child components, absolute path returns relative to the parent component/
    eachComponent(
      form.components,
      (component: Component, path: string, components, parent, paths) => {
        if (component.key === 'innerTextfield') {
          expect(paths?.dataPath).to.equal(
            'outer-container.inner-container.innerTextfield',
            'absolute path path is incomplete',
          );
        }
      },
    );
  });
});
