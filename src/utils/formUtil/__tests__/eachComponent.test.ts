import { expect } from 'chai';

import { eachComponent } from '../eachComponent';
import { isLayoutComponent } from '../index';

import { Component, TableComponent, HasChildComponents } from 'types';

describe('eachComponent', function () {
  const components = [
    {
      type: 'textfield',
      key: 'one',
      order: 1,
      input: true,
    },
    {
      input: false,
      key: 'parent1',
      components: [
        {
          type: 'textfield',
          key: 'two',
          order: 2,
        },
        {
          input: false,
          key: 'parent2',
          columns: [
            {
              components: [
                {
                  type: 'textfield',
                  key: 'three',
                  order: 3,
                },
              ],
            },
            {
              components: [
                {
                  rows: [
                    [
                      {
                        components: [
                          {
                            key: 'four',
                            order: 4,
                            type: 'textfield',
                          },
                        ],
                      },
                      {
                        components: [
                          {
                            key: 'five',
                            order: 5,
                            type: 'textfield',
                          },
                        ],
                      },
                    ],
                    [
                      {
                        components: [
                          {
                            key: 'six',
                            order: 6,
                            type: 'textfield',
                          },
                        ],
                      },
                      {
                        components: [
                          {
                            key: 'seven',
                            order: 7,
                            type: 'textarea',
                            rows: 3,
                          },
                        ],
                      },
                    ],
                  ],
                  type: 'table',
                },
              ],
            },
          ],
          type: 'columns',
        },
      ],
      type: 'well',
    },
    {
      key: 'eight',
      order: 8,
      type: 'button',
      input: true,
    },
  ];
  const components2 = [
    {
      type: 'textfield',
      conditional: {
        eq: '',
        when: null,
        show: null,
      },
      validate: {
        customPrivate: false,
        custom: '',
        pattern: '',
        maxLength: '',
        minLength: '',
        required: false,
      },
      persistent: true,
      unique: false,
      protected: false,
      defaultValue: '',
      multiple: false,
      suffix: '',
      prefix: '',
      placeholder: '',
      key: 'a',
      label: 'A',
      inputMask: '',
      inputType: 'text',
      tableView: true,
      input: true,
    },
    {
      lockKey: true,
      key: 'b',
      conditional: {
        eq: '',
        when: null,
        show: null,
      },
      type: 'fieldset',
      components: [
        {
          lockKey: true,
          key: 'c',
          conditional: {
            eq: '',
            when: null,
            show: null,
          },
          type: 'columns',
          columns: [
            {
              components: [
                {
                  type: 'textfield',
                  conditional: {
                    eq: '',
                    when: null,
                    show: null,
                  },
                  validate: {
                    customPrivate: false,
                    custom: '',
                    pattern: '',
                    maxLength: '',
                    minLength: '',
                    required: false,
                  },
                  persistent: true,
                  unique: false,
                  protected: false,
                  defaultValue: '',
                  multiple: false,
                  suffix: '',
                  prefix: '',
                  placeholder: '',
                  key: 'd',
                  label: 'D',
                  inputMask: '',
                  inputType: 'text',
                  tableView: true,
                  input: true,
                },
                {
                  conditional: {
                    eq: '',
                    when: null,
                    show: null,
                  },
                  type: 'container',
                  persistent: true,
                  protected: false,
                  key: 'f',
                  label: 'F',
                  tableView: true,
                  components: [
                    {
                      type: 'textfield',
                      conditional: {
                        eq: '',
                        when: null,
                        show: null,
                      },
                      validate: {
                        customPrivate: false,
                        custom: '',
                        pattern: '',
                        maxLength: '',
                        minLength: '',
                        required: false,
                      },
                      persistent: true,
                      unique: false,
                      protected: false,
                      defaultValue: '',
                      multiple: false,
                      suffix: '',
                      prefix: '',
                      placeholder: '',
                      key: 'g',
                      label: 'G',
                      inputMask: '',
                      inputType: 'text',
                      tableView: true,
                      input: true,
                    },
                    {
                      type: 'textfield',
                      conditional: {
                        eq: '',
                        when: null,
                        show: null,
                      },
                      validate: {
                        customPrivate: false,
                        custom: '',
                        pattern: '',
                        maxLength: '',
                        minLength: '',
                        required: false,
                      },
                      persistent: true,
                      unique: false,
                      protected: false,
                      defaultValue: '',
                      multiple: false,
                      suffix: '',
                      prefix: '',
                      placeholder: '',
                      key: 'h',
                      label: 'H',
                      inputMask: '',
                      inputType: 'text',
                      tableView: true,
                      input: true,
                    },
                    {
                      type: 'textfield',
                      conditional: {
                        eq: '',
                        when: null,
                        show: null,
                      },
                      validate: {
                        customPrivate: false,
                        custom: '',
                        pattern: '',
                        maxLength: '',
                        minLength: '',
                        required: false,
                      },
                      persistent: true,
                      unique: false,
                      protected: false,
                      defaultValue: '',
                      multiple: false,
                      suffix: '',
                      prefix: '',
                      placeholder: '',
                      key: 'i',
                      label: 'I',
                      inputMask: '',
                      inputType: 'text',
                      tableView: true,
                      input: true,
                    },
                  ],
                  tree: true,
                  input: true,
                },
              ],
            },
            {
              components: [
                {
                  type: 'textfield',
                  conditional: {
                    eq: '',
                    when: null,
                    show: null,
                  },
                  validate: {
                    customPrivate: false,
                    custom: '',
                    pattern: '',
                    maxLength: '',
                    minLength: '',
                    required: false,
                  },
                  persistent: true,
                  unique: false,
                  protected: false,
                  defaultValue: '',
                  multiple: false,
                  suffix: '',
                  prefix: '',
                  placeholder: '',
                  key: 'e',
                  label: 'E',
                  inputMask: '',
                  inputType: 'text',
                  tableView: true,
                  input: true,
                },
              ],
            },
          ],
          input: false,
        },
        {
          type: 'textfield',
          conditional: {
            eq: '',
            when: null,
            show: null,
          },
          validate: {
            customPrivate: false,
            custom: '',
            pattern: '',
            maxLength: '',
            minLength: '',
            required: false,
          },
          persistent: true,
          unique: false,
          protected: false,
          defaultValue: '',
          multiple: false,
          suffix: '',
          prefix: '',
          placeholder: '',
          key: 'j',
          label: 'J',
          inputMask: '',
          inputType: 'text',
          tableView: true,
          input: true,
        },
      ],
      legend: 'B',
      tableView: true,
      input: false,
    },
    {
      conditional: {
        eq: '',
        when: null,
        show: null,
      },
      type: 'datagrid',
      persistent: true,
      protected: false,
      key: 'k',
      label: 'K',
      tableView: true,
      components: [
        {
          conditional: {
            eq: '',
            when: null,
            show: null,
          },
          hideLabel: true,
          type: 'container',
          persistent: true,
          protected: false,
          key: 'n',
          label: 'N',
          tableView: true,
          components: [
            {
              type: 'textfield',
              conditional: {
                eq: '',
                when: null,
                show: null,
              },
              validate: {
                customPrivate: false,
                custom: '',
                pattern: '',
                maxLength: '',
                minLength: '',
                required: false,
              },
              persistent: true,
              unique: false,
              protected: false,
              defaultValue: '',
              multiple: false,
              suffix: '',
              prefix: '',
              placeholder: '',
              key: 'o',
              label: 'O',
              inputMask: '',
              inputType: 'text',
              tableView: true,
              input: true,
            },
            {
              type: 'textfield',
              conditional: {
                eq: '',
                when: null,
                show: null,
              },
              validate: {
                customPrivate: false,
                custom: '',
                pattern: '',
                maxLength: '',
                minLength: '',
                required: false,
              },
              persistent: true,
              unique: false,
              protected: false,
              defaultValue: '',
              multiple: false,
              suffix: '',
              prefix: '',
              placeholder: '',
              key: 'p',
              label: 'P',
              inputMask: '',
              inputType: 'text',
              tableView: true,
              input: true,
            },
            {
              type: 'textfield',
              conditional: {
                eq: '',
                when: null,
                show: null,
              },
              validate: {
                customPrivate: false,
                custom: '',
                pattern: '',
                maxLength: '',
                minLength: '',
                required: false,
              },
              persistent: true,
              unique: false,
              protected: false,
              defaultValue: '',
              multiple: false,
              suffix: '',
              prefix: '',
              placeholder: '',
              key: 'q',
              label: 'Q',
              inputMask: '',
              inputType: 'text',
              tableView: true,
              input: true,
            },
          ],
          tree: true,
          input: true,
        },
        {
          hideLabel: true,
          type: 'textfield',
          conditional: {
            eq: '',
            when: null,
            show: null,
          },
          validate: {
            customPrivate: false,
            custom: '',
            pattern: '',
            maxLength: '',
            minLength: '',
            required: false,
          },
          persistent: true,
          unique: false,
          protected: false,
          defaultValue: '',
          multiple: false,
          suffix: '',
          prefix: '',
          placeholder: '',
          key: 'm',
          label: 'M',
          inputMask: '',
          inputType: 'text',
          tableView: true,
          input: true,
        },
        {
          hideLabel: true,
          type: 'textfield',
          conditional: {
            eq: '',
            when: null,
            show: null,
          },
          validate: {
            customPrivate: false,
            custom: '',
            pattern: '',
            maxLength: '',
            minLength: '',
            required: false,
          },
          persistent: true,
          unique: false,
          protected: false,
          defaultValue: '',
          multiple: false,
          suffix: '',
          prefix: '',
          placeholder: '',
          key: 'l',
          label: 'L',
          inputMask: '',
          inputType: 'text',
          tableView: true,
          input: true,
        },
      ],
      tree: true,
      input: true,
    },
    {
      type: 'textfield',
      conditional: {
        eq: '',
        when: null,
        show: null,
      },
      validate: {
        customPrivate: false,
        custom: '',
        pattern: '',
        maxLength: '',
        minLength: '',
        required: false,
      },
      persistent: true,
      unique: false,
      protected: false,
      defaultValue: '',
      multiple: false,
      suffix: '',
      prefix: '',
      placeholder: '',
      key: 'r',
      label: 'R',
      inputMask: '',
      inputType: 'text',
      tableView: true,
      input: true,
    },
    {
      type: 'button',
      theme: 'primary',
      disableOnInvalid: true,
      action: 'submit',
      block: false,
      rightIcon: '',
      leftIcon: '',
      size: 'md',
      key: 'submit',
      tableView: false,
      label: 'Submit',
      input: true,
    },
    {
      label: 'Tagpad',
      tableView: false,
      key: 'tagpad',
      type: 'tagpad',
      input: true,
      components: [
        {
          label: 'Text Field',
          tableView: true,
          key: 'a',
          type: 'textfield',
          input: true,
        },
      ],
    },
  ];
  const components3 = [
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

  it('should iterate through nested components in the right order', function () {
    let n = 1;
    eachComponent(components, (component: Component) => {
      expect((component as any).order).to.equal(n);
      n += 1;
    });
  });

  it('should include layouts components if provided', function () {
    let numComps = 0;
    let numLayout = 0;
    eachComponent(
      components,
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
      components,
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
      components2,
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
    eachComponent(components2, (component: Component, path: string) => {
      testPaths.push(path);
    });
    expect(paths).to.deep.equal(testPaths);
  });

  it('should be able to block recursion', function () {
    let numComps = 0;
    let numLayout = 0;
    eachComponent(
      components,
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
    eachComponent(components3, (component: Component) => {
      if (component.type === 'htmlelement') {
        htmlComponentsAmount++;
      }
    });
    expect(htmlComponentsAmount).to.be.equal(0);
  });

  it('should include `htmlelement` components when `includeAll` is provided', function () {
    let htmlComponentsAmount = 0;
    eachComponent(
      components3,
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
    eachComponent(components3, (component: Component) => {
      if (component.type === 'content') {
        contentComponentsAmount++;
      }
    });
    expect(contentComponentsAmount).to.be.equal(0);
  });

  it('should include `content` components when `includeAll` is provided', function () {
    let contentComponentsAmount = 0;
    eachComponent(
      components3,
      (component: Component) => {
        if (component.type === 'content') {
          contentComponentsAmount++;
        }
      },
      true,
    );
    expect(contentComponentsAmount).to.be.equal(1);
  });

  it('should not mutate the path property if contained in component', function () {
    const components = [
      {
        type: 'textfield',
        key: 'textField',
        input: true,
        path: 'doNotMutate',
      },
      {
        type: 'container',
        key: 'container',
        input: true,
        path: 'doNotMutate',
        components: [
          {
            type: 'textfield',
            key: 'nestedTextField',
            path: 'doNotMutate',
            input: true,
          },
          {
            type: 'textarea',
            key: 'nestedTextArea',
            path: 'doNotMutate',
            input: true,
          },
        ],
      },
    ];
    eachComponent(
      components,
      (component: Component, path: string) => {
        if (component.key === 'textField') {
          expect(component.path).to.equal('doNotMutate');
          expect(path).to.equal('textField');
        }
        if (component.key === 'container') {
          expect(component.path).to.equal('doNotMutate');
          expect(path).to.equal('container');
        }
        if (component.key === 'nestedTextField') {
          expect(component.path).to.equal('doNotMutate');
          expect(path).to.equal('container.nestedTextField');
        }
        if (component.key === 'nestedTextArea') {
          expect(component.path).to.equal('doNotMutate');
          expect(path).to.equal('container.nestedTextArea');
        }
      },
      true,
    );
  });
});
