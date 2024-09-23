import { expect } from 'chai';
import { processSync } from '../../process';
import { conditionProcessInfo } from '../index';
import { ConditionsScope, ProcessContext } from 'types';
import { get } from 'lodash';

const processForm = (form: any, submission: any) => {
    const context: ProcessContext<ConditionsScope> = {
        processors: [conditionProcessInfo],
        components: form.components,
        data: submission.data,
        form,
        scope: {}
    };
    processSync(context);
    return context;
};

describe('Condition processor', () => {
  it('Should modify component\'s "hidden" property when conditionally visible is false', async () => {
    const form = {
      components: [
        {
          type: 'textfield',
          key: 'a',
          input: true,
        },
        {
          type: 'textfield',
          key: 'b',
          input: true,
          conditional: {
            show: false,
            conjunction: 'all',
            conditions: [
              {
                component: 'a',
                operator: 'isEmpty',
              },
            ],
          },
        },
      ],
    };

    const submission = {
      data: {
        a: '',
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.components[1]).to.haveOwnProperty('hidden');
    expect(context.components[1].hidden).to.be.true;
  });

  it('Should not define a conditional component (that condition is based on selectBoxes value) as hidden', async () => {
    const form1 = {
      components: [
        {
          label: 'Select Boxes',
          optionsLabelPosition: 'right',
          tableView: false,
          defaultValue: {
            '1': false,
            '2': false,
            '3': false,
            test3: false,
          },
          values: [
            {
              label: '1',
              value: '1',
              shortcut: '',
            },
            {
              label: '2',
              value: '2',
              shortcut: '',
            },
            {
              label: '3',
              value: '3',
              shortcut: '',
            },
          ],
          validateWhenHidden: false,
          key: 'selectBoxes',
          type: 'selectboxes',
          input: true,
          inputType: 'checkbox',
        },
        {
          label: 'Text Field',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textField',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'selectBoxes',
                operator: 'isEqual',
                value: '3',
              },
            ],
          },
          type: 'textfield',
          input: true,
        },
        {
          type: 'button',
          label: 'Submit',
          key: 'submit',
          disableOnInvalid: true,
          input: true,
          tableView: false,
        },
      ],
    };

    const submission1 = {
      data: {
        selectBoxes: {
          '1': false,
          '2': false,
          '3': true,
        },
        textField: 'test',
        submit: true,
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form1,
      submission1
    );

    expect(get(context, 'scope.conditionals[0].conditionallyHidden')).to.be
      .false;
  });

  it('Should always add components keyed by absolute path to conditional scope (simple components)', async () => {
    const form = {
      components: [
        {
          type: 'textfield',
          key: 'a',
          input: true,
        },
        {
          type: 'textfield',
          key: 'b',
          input: true,
          conditional: {
            show: false,
            conjunction: 'all',
            conditions: [
              {
                component: 'a',
                operator: 'isEmpty',
              },
            ],
          },
        },
      ],
    };

    const submission = {
      data: {
        a: '',
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(1);
    expect(context.scope.conditionals?.[0].path).to.equal('b');
  });

  it('Should always add components keyed by absolute data path to conditional scope (data grid components)', async () => {
    const form = {
      components: [
        {
          label: 'Check Me',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkMe',
          type: 'checkbox',
          input: true,
          defaultValue: false,
        },
        {
          label: 'Data Grid',
          reorder: false,
          addAnotherPosition: 'bottom',
          layoutFixed: false,
          enableRowGroups: false,
          initEmpty: false,
          tableView: false,
          defaultValue: [{}],
          validateWhenHidden: false,
          key: 'dataGrid',
          type: 'datagrid',
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'checkMe',
                    operator: 'isEqual',
                    value: true,
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField1',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        checkMe: false,
        dataGrid: [{ textField: 'test' }, { textField: 'test1' }],
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(2);
    expect(context.scope.conditionals?.[0].path).to.equal(
      'dataGrid[0].textField'
    );
    expect(context.scope.conditionals?.[1].path).to.equal(
      'dataGrid[1].textField'
    );
  });

  it('Should always add components keyed by absolute data path to conditional scope (edit grid components)', async () => {
    const form = {
      components: [
        {
          label: 'Check Me',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkMe',
          type: 'checkbox',
          input: true,
          defaultValue: false,
        },
        {
          label: 'Edit Grid',
          reorder: false,
          addAnotherPosition: 'bottom',
          layoutFixed: false,
          enableRowGroups: false,
          initEmpty: false,
          tableView: false,
          defaultValue: [{}],
          validateWhenHidden: false,
          key: 'editGrid',
          type: 'editgrid',
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'checkMe',
                    operator: 'isEqual',
                    value: true,
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField1',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        checkMe: false,
        editGrid: [{ textField: 'test' }, { textField: 'test1' }],
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(2);
    expect(context.scope.conditionals?.[0].path).to.equal(
      'editGrid[0].textField'
    );
    expect(context.scope.conditionals?.[1].path).to.equal(
      'editGrid[1].textField'
    );
  });

  it('Should always add components keyed by absolute data path to conditional scope (container components)', async () => {
    const form = {
      components: [
        {
          label: 'Check Me',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkMe',
          type: 'checkbox',
          input: true,
          defaultValue: false,
        },
        {
          label: 'Container',
          tableView: false,
          key: 'container',
          type: 'container',
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'checkMe',
                    operator: 'isEqual',
                    value: true,
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField1',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        checkMe: false,
        container: { textField: 'test' },
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(1);
    expect(context.scope.conditionals?.[0].path).to.equal(
      'container.textField'
    );
  });

  it('Should always add components keyed by absolute data path to conditional scope (layout components)', async () => {
    const form = {
      components: [
        {
          label: 'Check Me',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkMe',
          type: 'checkbox',
          input: true,
          defaultValue: false,
        },
        {
          label: 'Panel',
          tableView: false,
          key: 'panel',
          type: 'panel',
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'checkMe',
                    operator: 'isEqual',
                    value: true,
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField1',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        checkMe: false,
        panel: { textField: 'test' },
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(1);
    // Panel components are layout components, so are not pathed
    expect(context.scope.conditionals?.[0].path).to.equal('textField');
  });

  it('Should always add components keyed by absolute data path to conditional scope (deeply nested components)', async () => {
    const form = {
      components: [
        {
          label: 'Tabs',
          components: [
            {
              label: 'Tab 1',
              key: 'tab1',
              components: [
                {
                  label: 'Check Me',
                  tableView: false,
                  validateWhenHidden: false,
                  key: 'checkMe',
                  type: 'checkbox',
                  input: true,
                  defaultValue: false,
                },
              ],
            },
            {
              label: 'Tab 2',
              key: 'tab2',
              components: [
                {
                  label: 'Outer Data Grid',
                  reorder: false,
                  addAnotherPosition: 'bottom',
                  layoutFixed: false,
                  enableRowGroups: false,
                  initEmpty: false,
                  tableView: false,
                  defaultValue: [
                    {
                      outerContainer: {
                        innerContainer: {
                          dataGrid: [
                            {
                              textField1: '',
                            },
                          ],
                        },
                      },
                    },
                  ],
                  validateWhenHidden: false,
                  key: 'outerDataGrid',
                  type: 'datagrid',
                  input: true,
                  components: [
                    {
                      label: 'Outer Container',
                      tableView: false,
                      validateWhenHidden: false,
                      key: 'outerContainer',
                      type: 'container',
                      input: true,
                      components: [
                        {
                          label: 'Inner Container',
                          tableView: false,
                          validateWhenHidden: false,
                          key: 'innerContainer',
                          type: 'container',
                          input: true,
                          components: [
                            {
                              label: 'Inner Data Grid',
                              reorder: false,
                              addAnotherPosition: 'bottom',
                              layoutFixed: false,
                              enableRowGroups: false,
                              initEmpty: false,
                              tableView: false,
                              defaultValue: [
                                {
                                  textField1: '',
                                },
                              ],
                              validateWhenHidden: false,
                              key: 'innerDataGrid',
                              type: 'datagrid',
                              input: true,
                              components: [
                                {
                                  label: 'Text Field',
                                  applyMaskOn: 'change',
                                  tableView: true,
                                  validateWhenHidden: false,
                                  key: 'textField',
                                  conditional: {
                                    show: true,
                                    conjunction: 'all',
                                    conditions: [
                                      {
                                        component: 'checkMe',
                                        operator: 'isEqual',
                                        value: true,
                                      },
                                    ],
                                  },
                                  type: 'textfield',
                                  input: true,
                                },
                                {
                                  label: 'Text Field',
                                  applyMaskOn: 'change',
                                  tableView: true,
                                  validateWhenHidden: false,
                                  key: 'textField1',
                                  type: 'textfield',
                                  input: true,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          key: 'tabs',
          type: 'tabs',
          input: false,
          tableView: false,
        },
      ],
    };

    const submission = {
      data: {
        checkMe: false,
        outerDataGrid: [
          {
            outerContainer: {
              innerContainer: {
                innerDataGrid: [
                  {
                    textField1: 'test',
                  },
                ],
              },
            },
          },
        ],
        submit: true,
      },
    };

    const context: ProcessContext<ConditionsScope> = processForm(
      form,
      submission
    );
    expect(context.scope.conditionals).to.have.length(1);
    expect(context.scope.conditionals?.[0].path).to.equal(
      'outerDataGrid[0].outerContainer.innerContainer.innerDataGrid[0].textField'
    );
  });

  it('Should not hide other components data from submission when address component is filled out', async () => {

    const form = {
      name: 'address1',
      path: 'address1',
      type: 'form',
      display: 'form',

      components: [
        {
          label: 'Address - Google Maps',
          tableView: true,
          provider: 'google',
          key: 'address3',
          type: 'address',
          providerOptions: {
            params: {
              key: 'SOME KEY',
              region: '',
              autocompleteOptions: {},
            },
            apiKey: 'SOME KEY',
          },
          input: true,
          components: [
            {
              label: 'Address 1',
              tableView: false,
              key: 'address4',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Address 2',
              tableView: false,
              key: 'address5',
              type: 'textfield',
              input: true,
            },
            {
              label: 'City',
              tableView: false,
              key: 'city1',
              type: 'textfield',
              input: true,
            },
            {
              label: 'State',
              tableView: false,
              key: 'state1',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Country',
              tableView: false,
              key: 'country1',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Zip Code',
              tableView: false,
              key: 'zip1',
              type: 'textfield',
              input: true,
            },
          ],
        },
        {
          label: 'Number',
          applyMaskOn: 'change',
          mask: false,
          tableView: false,
          delimiter: false,
          requireDecimal: false,
          inputFormat: 'plain',
          truncateMultipleSpaces: false,
          validateWhenHidden: false,
          key: 'number',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'address3',
                operator: 'isNotEmpty',
              },
            ],
          },
          type: 'number',
          input: true,
        },
        {
          label: 'Text Field',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textField',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'address3',
                operator: 'isNotEmpty',
              },
            ],
          },
          type: 'textfield',
          input: true,
        },
        {
          type: 'button',
          label: 'Submit',
          key: 'submit',
          disableOnInvalid: true,
          input: true,
          tableView: false,
        },
      ],
    };

    const data = {
      address3: {
        address_components: [
          {
            long_name: 'Delhi',
            short_name: 'DL',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'Delhi Division',
            short_name: 'Delhi Division',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'India',
            short_name: 'IN',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'Delhi, India',
        geometry: {
          location: {
            lat: 28.7040592,
            lng: 77.10249019999999,
          },
          viewport: {
            south: 28.40466749911707,
            west: 76.83889206854818,
            north: 28.88349965721584,
            east: 77.34757038508486,
          },
        },
        place_id: 'ChIJLbZ-NFv9DDkRQJY4FbcFcgM',
        types: ['administrative_area_level_1', 'political'],
        formattedPlace: 'Delhi, India',
      },
      number: 1,
      textField: 'some text',
      submit: true,
    };

    const submission = {
      data,
    };

    const context: ProcessContext<ConditionsScope> = processForm(form, submission);
    const conditionalComponentsPaths = ['number', 'textField'];
    const conditionalComponents = context.scope?.conditionals?.filter((x) => conditionalComponentsPaths.includes(x.path));
    const isAllVisible = conditionalComponents?.every((x) => x.conditionallyHidden === false);
    expect(isAllVisible).to.equal(true);
   });
});
