import { expect } from 'chai';
import assert from 'node:assert'
import type { ContainerComponent, ValidationScope } from 'types';
import { getComponent } from 'utils/formUtil';
import { process, processSync, ProcessTargets } from '../index';
import { addressComponentWithOtherCondComponents, clearOnHideWithCustomCondition, clearOnHideWithHiddenParent, forDataGridRequired, skipValidForConditionallyHiddenComp, skipValidForLogicallyHiddenComp, skipValidWithHiddenParentComp  } from './fixtures'
/*
describe('Process Tests', () => {
    it('Should perform the processes using the processReduced method.', async () => {
        const reduced: ReducerScope = process({
            components: form1.components,
            data: data1a.data,
            scope: {
                processes: {}
            }
        });
        const targets = processReduceTargets(reduced.processes);
        expect(targets.length).to.equal(5);
        expect(targets[0].target).to.equal('server');
        expect(Object.keys(targets[0].processes).length).to.equal(1);
        expect(targets[0].processes.defaultValue.length).to.equal(6);
        expect(targets[1].target).to.equal('custom');
        expect(Object.keys(targets[1].processes).length).to.equal(1);
        expect(targets[1].processes.customDefaultValue.length).to.equal(1);
        expect(targets[2].target).to.equal('server');
        expect(Object.keys(targets[2].processes).length).to.equal(1);
        expect(targets[2].processes.fetch.length).to.equal(1);
        expect(targets[3].target).to.equal('custom');
        expect(Object.keys(targets[3].processes).length).to.equal(1);
        expect(targets[3].processes.calculate.length).to.equal(6);
        expect(targets[4].target).to.equal('server');
        expect(Object.keys(targets[4].processes).length).to.equal(2);
        expect(targets[4].processes.conditions.length).to.equal(1);
        expect(targets[4].processes.validate.length).to.equal(28);
        const scope = {errors: []};

        // Reset all values that will be calculated.
        reduced.data.subtotal = 0;
        reduced.data.taxes = 0;
        reduced.data.total = 0;
        reduced.data.cart.forEach((item: any) => {
            item.price = 0;
        });
        for (let i = 0; i < targets.length; i++) {
            await processReduced({
                components: form1.components,
                data: reduced.data,
                processes: targets[i].processes,
                fetch: (url: string, options?: RequestInit | undefined): Promise<Response> => {
                    return Promise.resolve({
                        json: () => {
                            return Promise.resolve(subs);
                        }
                    } as Response);
                },
                scope
            });
        }
        expect(reduced.data.subtotal).to.equal(100);
        expect(reduced.data.taxes).to.equal(8);
        expect(reduced.data.total).to.equal(108);
        expect(reduced.data.cart[0].price).to.equal(30);
        expect(reduced.data.cart[1].price).to.equal(20);
        expect(reduced.data.cart[2].price).to.equal(10);
    });
});
*/

describe('Process Tests', () => {
  it('Should submit data within a nested form.', async () => {
    const form = {
      _id: {},
      title: 'parent-fio-8023',
      name: 'parentFio8023',
      path: 'parentfio8023',
      type: 'form',
      display: 'wizard',
      tags: [],
      deleted: null,
      access: [
        {
          type: 'read_all',
          roles: [{}, {}, {}],
        },
      ],
      submissionAccess: [],
      owner: {},
      components: [
        {
          title: 'Nested Wizard',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true,
          },
          collapsible: false,
          key: 'page1',
          type: 'panel',
          label: 'Nested Wizard',
          tableView: false,
          components: [
            {
              label: 'HTML',
              attrs: [
                {
                  attr: '',
                  value: '',
                },
              ],
              content:
                '- Nested Wizard inside Parent Form\n<br>- Nested Wizard pages should follow the Parent Wizard page\n<br>- No Nested Wizard pages should display in a Parent Wizard page\n<br>- Should not be able to submit the Parent Wizard until all the Child and Parent field validation is satisified',
              refreshOnChange: false,
              key: 'html',
              type: 'htmlelement',
              tableView: false,
              input: false,
            },
            {
              label: 'Parent Text',
              tableView: true,
              validate: {
                required: true,
              },
              key: 'parentText',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Parent Number',
              mask: false,
              spellcheck: true,
              tableView: false,
              delimiter: false,
              requireDecimal: false,
              inputFormat: 'plain',
              validate: {
                required: true,
              },
              key: 'parentNumber',
              type: 'number',
              input: true,
            },
            {
              label: 'Signature',
              tableView: false,
              validate: {
                required: true,
              },
              key: 'signature',
              type: 'signature',
              input: true,
            },
          ],
          input: false,
        },
        {
          title: 'Nested EditGrid/DataGrid',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true,
          },
          collapsible: false,
          tableView: false,
          key: 'page2',
          type: 'panel',
          label: 'Page 2',
          input: false,
          components: [
            {
              label: 'Form',
              tableView: true,
              form: '65ea3662705068f84a93c781',
              useOriginalRevision: false,
              key: 'form1',
              type: 'form',
              revision: '1',
              input: true,
              components: [
                {
                  title: 'Basic Components',
                  theme: 'info',
                  breadcrumbClickable: true,
                  buttonSettings: {
                    previous: true,
                    cancel: true,
                    next: true,
                  },
                  collapsible: false,
                  key: 'page1',
                  type: 'panel',
                  label: 'Basic Components',
                  tableView: false,
                  components: [
                    {
                      label: 'Number',
                      mask: false,
                      spellcheck: true,
                      tableView: false,
                      delimiter: false,
                      requireDecimal: false,
                      inputFormat: 'plain',
                      validate: {
                        required: true,
                      },
                      key: 'number',
                      type: 'number',
                      input: true,
                    },
                    {
                      label: 'Checkbox',
                      tableView: false,
                      validate: {
                        required: true,
                      },
                      key: 'checkbox',
                      type: 'checkbox',
                      input: true,
                      defaultValue: false,
                    },
                    {
                      label: 'Select Boxes',
                      optionsLabelPosition: 'right',
                      tableView: false,
                      values: [
                        {
                          label: 'SB - A',
                          value: 'sbA',
                          shortcut: '',
                        },
                        {
                          label: 'SB - B',
                          value: 'sbB',
                          shortcut: '',
                        },
                        {
                          label: 'SB - C',
                          value: 'sbC',
                          shortcut: '',
                        },
                        {
                          label: 'SB - D',
                          value: 'sbD',
                          shortcut: '',
                        },
                      ],
                      validate: {
                        required: true,
                      },
                      key: 'selectBoxes1',
                      type: 'selectboxes',
                      input: true,
                      inputType: 'checkbox',
                      defaultValue: {
                        '': false,
                        sbA: false,
                        sbB: false,
                        sbC: false,
                        sbD: false,
                      },
                    },
                    {
                      label: 'Select',
                      widget: 'choicesjs',
                      tableView: true,
                      data: {
                        values: [
                          {
                            label: 'SA',
                            value: 'sa',
                          },
                          {
                            label: 'Sb',
                            value: 'sb',
                          },
                          {
                            label: 'SC',
                            value: 'sc',
                          },
                        ],
                      },
                      validate: {
                        required: true,
                      },
                      key: 'select1',
                      type: 'select',
                      input: true,
                    },
                    {
                      label: 'Select - URL',
                      widget: 'choicesjs',
                      tableView: true,
                      dataSrc: 'url',
                      data: {
                        url: 'https://cdn.rawgit.com/mshafrir/2646763/raw/states_titlecase.json',
                        headers: [
                          {
                            key: '',
                            value: '',
                          },
                        ],
                      },
                      template: '<span>{{ item.name }}</span>',
                      validate: {
                        required: true,
                      },
                      key: 'selectUrl',
                      type: 'select',
                      input: true,
                      disableLimit: false,
                    },
                    {
                      label: 'Radio',
                      optionsLabelPosition: 'right',
                      inline: false,
                      tableView: false,
                      values: [
                        {
                          label: 'Ra',
                          value: 'ra',
                          shortcut: '',
                        },
                        {
                          label: 'Rb',
                          value: 'rb',
                          shortcut: '',
                        },
                        {
                          label: 'Rc',
                          value: 'rc',
                          shortcut: '',
                        },
                      ],
                      validate: {
                        required: true,
                      },
                      key: 'radio1',
                      type: 'radio',
                      input: true,
                    },
                  ],
                  input: false,
                },
                {
                  title: 'Advanced',
                  theme: 'primary',
                  breadcrumbClickable: true,
                  buttonSettings: {
                    previous: true,
                    cancel: true,
                    next: true,
                  },
                  collapsible: false,
                  key: 'page2',
                  type: 'panel',
                  label: 'Advanced',
                  tableView: false,
                  input: false,
                  components: [
                    {
                      label: 'Email',
                      tableView: true,
                      validate: {
                        required: true,
                      },
                      key: 'email',
                      type: 'email',
                      input: true,
                    },
                    {
                      label: 'Url',
                      tableView: true,
                      validate: {
                        required: true,
                      },
                      key: 'url',
                      type: 'url',
                      input: true,
                    },
                    {
                      label: 'Phone Number',
                      tableView: true,
                      validate: {
                        required: true,
                      },
                      key: 'phoneNumber',
                      type: 'phoneNumber',
                      input: true,
                    },
                    {
                      label: 'Tags',
                      tableView: false,
                      validate: {
                        required: true,
                      },
                      key: 'tags',
                      type: 'tags',
                      input: true,
                    },
                    {
                      label: 'Address',
                      tableView: false,
                      provider: 'google',
                      validate: {
                        required: true,
                      },
                      key: 'address',
                      type: 'address',
                      providerOptions: {
                        params: {
                          key: '',
                          region: '',
                          autocompleteOptions: {},
                        },
                      },
                      input: true,
                      components: [
                        {
                          label: 'Address 1',
                          tableView: false,
                          key: 'address1',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Address 2',
                          tableView: false,
                          key: 'address2',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'City',
                          tableView: false,
                          key: 'city',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'State',
                          tableView: false,
                          key: 'state',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Country',
                          tableView: false,
                          key: 'country',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Zip Code',
                          tableView: false,
                          key: 'zip',
                          type: 'textfield',
                          input: true,
                          customConditional:
                            "show = _.get(instance, 'parent.manualMode', false);",
                        },
                      ],
                    },
                    {
                      label: 'Date / Time',
                      tableView: false,
                      enableMinDateInput: false,
                      datePicker: {
                        disableWeekends: false,
                        disableWeekdays: false,
                      },
                      enableMaxDateInput: false,
                      validate: {
                        required: true,
                      },
                      key: 'dateTime',
                      type: 'datetime',
                      input: true,
                      widget: {
                        type: 'calendar',
                        displayInTimezone: 'viewer',
                        locale: 'en',
                        useLocaleSettings: false,
                        allowInput: true,
                        mode: 'single',
                        enableTime: true,
                        noCalendar: false,
                        format: 'yyyy-MM-dd hh:mm a',
                        hourIncrement: 1,
                        minuteIncrement: 1,
                        time_24hr: false,
                        minDate: null,
                        disableWeekends: false,
                        disableWeekdays: false,
                        maxDate: null,
                      },
                    },
                    {
                      label: 'Day',
                      hideInputLabels: false,
                      inputsLabelPosition: 'top',
                      useLocaleSettings: false,
                      tableView: false,
                      fields: {
                        day: {
                          hide: false,
                          required: true,
                        },
                        month: {
                          hide: false,
                          required: true,
                        },
                        year: {
                          hide: false,
                          required: true,
                        },
                      },
                      key: 'day',
                      type: 'day',
                      input: true,
                      defaultValue: '00/00/0000',
                    },
                    {
                      label: 'Time',
                      tableView: true,
                      dataFormat: 'HH:mm:ss a',
                      validate: {
                        required: true,
                      },
                      key: 'time',
                      type: 'time',
                      input: true,
                      inputMask: '99:99',
                    },
                    {
                      label: 'Currency',
                      mask: false,
                      spellcheck: true,
                      tableView: false,
                      currency: 'USD',
                      inputFormat: 'plain',
                      validate: {
                        required: true,
                      },
                      key: 'currency',
                      type: 'currency',
                      input: true,
                      delimiter: true,
                    },
                    {
                      label: 'Signature',
                      tableView: false,
                      validate: {
                        required: true,
                      },
                      key: 'signature',
                      type: 'signature',
                      input: true,
                    },
                  ],
                },
                {
                  title: 'DataGrid / EditGrid',
                  theme: 'danger',
                  breadcrumbClickable: true,
                  buttonSettings: {
                    previous: true,
                    cancel: true,
                    next: true,
                  },
                  collapsible: false,
                  key: 'page3',
                  type: 'panel',
                  label: 'DataGrid / EditGrid',
                  tableView: false,
                  input: false,
                  components: [
                    {
                      label: 'Data Grid',
                      reorder: false,
                      addAnotherPosition: 'bottom',
                      defaultOpen: false,
                      layoutFixed: false,
                      enableRowGroups: false,
                      tableView: false,
                      defaultValue: [{}],
                      key: 'dataGrid',
                      type: 'datagrid',
                      input: true,
                      components: [
                        {
                          label: 'Checkbox',
                          tableView: false,
                          validate: {
                            required: true,
                          },
                          key: 'checkbox',
                          type: 'checkbox',
                          input: true,
                          defaultValue: false,
                        },
                        {
                          label: 'Select',
                          widget: 'choicesjs',
                          tableView: true,
                          dataSrc: 'resource',
                          data: {
                            resource: '65e9eb1aee138974f569d619',
                          },
                          valueProperty: 'data.text',
                          template: '<span>{{ item.data.text }}</span>',
                          validate: {
                            select: false,
                          },
                          key: 'select',
                          type: 'select',
                          searchField: 'data.text__regex',
                          input: true,
                          addResource: false,
                          reference: false,
                        },
                        {
                          label: 'Radio',
                          optionsLabelPosition: 'right',
                          inline: false,
                          tableView: false,
                          values: [
                            {
                              label: 'Ra',
                              value: 'ra',
                              shortcut: '',
                            },
                            {
                              label: 'Rb',
                              value: 'rb',
                              shortcut: '',
                            },
                            {
                              label: 'Rc',
                              value: 'rc',
                              shortcut: '',
                            },
                          ],
                          validate: {
                            required: true,
                          },
                          key: 'radio1',
                          type: 'radio',
                          input: true,
                        },
                      ],
                    },
                    {
                      label: 'Edit Grid',
                      tableView: true,
                      rowDrafts: false,
                      key: 'editGrid',
                      type: 'editgrid',
                      input: true,
                      components: [
                        {
                          label: 'Date / Time',
                          tableView: true,
                          enableMinDateInput: false,
                          datePicker: {
                            disableWeekends: false,
                            disableWeekdays: false,
                          },
                          enableMaxDateInput: false,
                          validate: {
                            required: true,
                          },
                          key: 'dateTime',
                          type: 'datetime',
                          input: true,
                          widget: {
                            type: 'calendar',
                            displayInTimezone: 'viewer',
                            locale: 'en',
                            useLocaleSettings: false,
                            allowInput: true,
                            mode: 'single',
                            enableTime: true,
                            noCalendar: false,
                            format: 'yyyy-MM-dd hh:mm a',
                            hourIncrement: 1,
                            minuteIncrement: 1,
                            time_24hr: false,
                            minDate: null,
                            disableWeekends: false,
                            disableWeekdays: false,
                            maxDate: null,
                          },
                        },
                        {
                          label: 'Address',
                          tableView: true,
                          provider: 'google',
                          key: 'address',
                          type: 'address',
                          providerOptions: {
                            params: {
                              key: '',
                              region: '',
                              autocompleteOptions: {},
                            },
                          },
                          input: true,
                          components: [
                            {
                              label: 'Address 1',
                              tableView: false,
                              key: 'address1',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
                            },
                            {
                              label: 'Address 2',
                              tableView: false,
                              key: 'address2',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
                            },
                            {
                              label: 'City',
                              tableView: false,
                              key: 'city',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
                            },
                            {
                              label: 'State',
                              tableView: false,
                              key: 'state',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
                            },
                            {
                              label: 'Country',
                              tableView: false,
                              key: 'country',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
                            },
                            {
                              label: 'Zip Code',
                              tableView: false,
                              key: 'zip',
                              type: 'textfield',
                              input: true,
                              customConditional:
                                "show = _.get(instance, 'parent.manualMode', false);",
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
      settings: {
        share: {
          theme: '',
          showHeader: true,
        },
      },
      properties: {},
      project: {},
      controller: '',
      revisions: '',
      submissionRevisions: '',
      _vid: 0,
      created: '2024-03-07T21:50:03.872Z',
      modified: '2024-03-07T21:50:03.879Z',
      machineName: 'authoring-oaomxjpqpoigtqg:parentFio8023',
      __v: 0,
    };
    const submission = {
      data: {
        parentText: 'test',
        signature:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABgAAAACWCAYAAAAYAUMPAAAAAXNSR0IArs4c6QAAFkZJREFUeF7t3SFsHGcWB/Cv2CAo8MoTnQrCksiVysyuMFLCgwod4KXngBgWpTigsGHLTurKV3YgqlRyJK5UYrz4Tp97u9rsOWvv8+zOm29+Q6Ik+82893sf2v/OzBfz+eV/ioMAAQIECBAgQIAAAQIECBAgQIAAAQIECBBoSuALAUBT89QMAQIECBAgQIAAAQIECBAgQIAAAQIECBC4EhAA2AgECBAgQIAAAQIECBAgQIAAAQIECBAgQKBBAQFAg0PVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoEEBAUCDQ9USAQIECBAgQIAAAQIECBAgQIAAAQIECBAQANgDBAgQIECAAAECBAgQIECAAAECBAgQIECgQQEBQIND1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKBBAQFAg0PVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoEEBAUCDQ9USAQIECBAgQIAAAQIECBAgQIAAAQIECBAQANgDBAgQIECAAAECBAgQIECAAAECBAgQIECgQQEBQIND1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKBBAQFAg0PVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoEEBAUCDQ9USAQIECBAgQIAAAQIECBAgQIAAAQIECBAQANgDBAgQIECAAAECBAgQIECAAAECBAgQIECgQQEBQIND1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKBBAQFAg0PVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYA6kFjo6+LYeHT8pk8ip1nYojQIAAAQIECBAgQIAAAQIECBAgQIBANgEBQLaJqGcpMJudlz8DgKdlOv2JDAECBAgQIECAAAECBAgQIECAAAECBAhsISAA2ALLR/crsAgA6lXn88v9XtzVCBAgQIAAAQIECBAgQIAAAQIECBAgMHABAcDAB9hy+QKAlqerNwIECBAgQIAAAQIECBAgQIAAAQIEdi0gANi1sPOHBQQAYToLCRAgQIAAAQIECBAgQIAAAQIECBAgUAQANkFagdUAoL4DoL4LwEGAAAECBAgQIECAAAECBAgQIECAAAECtxMQANzOyad6EBAA9IDukgQIECBAgAABAgQIECBAgAABAgQINCMgAGhmlG02cnBw/6qxk5PjMpm8arNJXREgQIAAAQIECBAgQIAAAQIECBAgQGAHAgKAHaA6ZXcCAoDuLJ2JAAECBAgQIECAAAECBAgQIECAAIFxCQgAxjXvwXUrABjcyBRMgAABAgQIECBAgAABAgQIECBAgEASAQFAkkEo43qBRQBQXwBcXwTsIECAAAECBAgQIECAAAECBAgQIECAAIHbCQgAbufkUz0JCAB6gndZAgQIECBAgAABAgQIECBAgAABAgQGLyAAGPwI225gEQDULufzy7ab1R0BAgQIECBAgAABAgQIECBAgAABAgQ6FBAAdIjpVN0LCAC6N3VGAgQIECBAgAABAgQIECBAgAABAgTGISAAGMecb+xyNjsv9Tn72Y7VAKC+AyBjjdnM1EOAAAECBAgQIECAAAECBAgQIECAAIEqIAAY8T6oX/qfnp6V+ufiODk5Ll9//TTNF+1HR98u6xMAjHizap0AAQIECBAgQIAAAQIECBAgQIAAga0FBABbkw1/wenpm/L69dnGRp4/f1YuLi7KdPq+14ZXA4AaTkwmr3qtx8UJECBAgAABAgQIECBAgAABAgQIECAwFAEBwFAm1WGdL19+V969+/FWZ/zqq7+WN2/+3tsdAQKAW43JhwgQIECAAAECBAgQIECAAAECBAgQIPB/AgKAEW6Kx4+/KR8+/PpJ5/XZ+quPAlr9z/p/k8lxLyGAAGCEG1TLBAgQIECAAAECBAgQIECAAAECBAh0IiAA6IRxWCdZfbFu/YX/L7/8Y9nApscD9fEM/tV6ahBRa3AQIECAAAECBAgQIECAAAECBAgQIECAwM0CAoCbjZr6RP2Vf/1V/eL43Jf6n3tM0L6fwy8AaGr7aYYAAQIECBAgQIAAAQIECBAgQIAAgT0KCAD2iJ3lUqt3AGz6Vf/n7gbYZwggAMiya9RBgAABAgQIECBAgAABAgQIECBAgMDQBAQAQ5tYB/WuBgA3fZnfdwggAOhg4E5BgAABAgQIECBAgAABAgQIECBAgMAoBQQAIxz7p1+qPynT6fuNCn2+F0AAMMINqmUCBAgQIECAAAECBAgQIECAAAECBDoREAB0wjisk6w+3//evXvljz/+fWMD9d0Bp6dnpf65fsznlzeuj36gvq9gcU0vAY4qWkeAAAECBAgQIECAAAECBAgQIECAwBgFBAAjnPpdflV/3d0Au/xiXgAwwg2qZQIECBAgQIAAAQIECBAgQIAAAQIEOhEQAHTCOKyTrH+Jv+0v+PcZAggAhrW3VEuAAAECBAgQIECAAAECBAgQIECAQB4BAUCeWeytkrvcAbAo8roQ4KYXCkcaFABE1KwhQIAAAQIECBAgQIAAAQIECBAgQIBAKQKAEe6Cu94BsCkEmE5/KvWRQF0dAoCuJJ2HAAECBAgQIECAAAECBAgQIECAAIGxCQgAxjbxUkpXAUClWz/Xl1/+pfz22786U10NAHZxh0FnhToRAQIECBAgQIAAAQIECBAgQIAAAQIEkgkIAJINZB/ldBkA1HpXv6Svf3/x4ll5+/b7TloRAHTC6CQECBAgQIAAAQIECBAgQIAAAQIECIxQQAAwwqF38Q6AdbYHDx6Vi4vfl//c1a/1Dw7uL8/Z9eOFRjh6LRMgQIAAAQIECBAgQIAAAQIECBAgMCIBAcCIhr1o9eXL78q7dz8uO5/PL++sMJudX90JsHp0EQI8fPiofPz4Z7DQxfnu3KgTECBAgAABAgQIECBAgAABAgQIECBAYCACAoCBDKrLMrt+BNCitl2EAKt3Fjx//qz88EM3jxbq0tO5CBAgQIAAAQIECBAgQIAAAQIECBAgkFFAAJBxKjuuaf2Z/V3cAbApBLjLo3u8A2DHm8HpCRAgQIAAAQIECBAgQIAAAQIECBBoVkAA0OxoP9/YLgOAetX1Owzqv0VDgNVaDw+fXp3HQYAAAQIECBAgQIAAAQIECBAgQIAAAQI3CwgAbjZq7hPrAUD0y/lNMF2FAO4AaG77aYgAAQIECBAgQIAAAQIECBAgQIAAgT0JCAD2BJ3pMvsIAGq/XYQAAoBMO0ctBAgQIECAAAECBAgQIECAAAECBAgMSUAAMKRpdVTrrh8BtFrmdSHANu8cEAB0NHSnIUCAAAECBAgQIECAAAECBAgQIEBgdAICgNGNvJR9BgCVdz0E2OZZ/gcH95cTOjk5LpPJqxFOTMsECBAgQIAAAQIECBAgQIAAAQIECBDYXkAAsL3Z4Fc8fPiofPz4+7KPXbwDYB0pGgKsBgD7qHPww9UAAQIECBAgQIAAAQIECBAgQIAAAQIE/icgABjhVnjw4FG5uNhvAFCZ10OAFy+elbdvv984AQHACDeolgkQIECAAAECBAgQIECAAAECBAgQ6ERAANAJ47BOsvqleq18n4/Wmc3Orx5BtDg2PQ5o/bPuABjWPlMtAQIECBAgQIAAAQIECBAgQIAAAQL9CggA+vXv5ep9BgC14etCgMnkuNQwYPUQAPSyPVyUAAECBAgQIECAAAECBAgQIECAAIFGBAQAjQxymzb6DgAWIcDp6dlVGLA4Dg+flOn0/fLv648McgfANlP2WQIECBAgQIAAAQIECBAgQIAAAQIExi4gABjhDsgQACzY6+OAPg0Bnpb6RX891uuczy9HOC0tEyBAgAABAgQIECBAgAABAgQIECBAICYgAIi5DXrV+hfrff+y/vHjb8qHD78uTes7Cerx+vXZ8t82vStg0MNQPAECBAgQIECAAAECBAgQIECAAAECBHYkIADYEWzm064+WifLF+vrIcC6X98hReZ5qo0AAQIECBAgQIAAAQIECBAgQIAAAQLXCQgARrovFo/dWX/xbp8c63cmLGrJElL0aePaBAgQIECAAAECBAgQIECAAAECBAgQ2FZAALCtmM/vTKCGEvWdAOuHX//vjNyJCRAgQIAAAQIECBAgQIAAAQIECBBoWEAA0PBwh9ra0dHfymz2z6vy/fp/qFNUNwECBAgQIECAAAECBAgQIECAAAECfQsIAPqegOtfK1DvBvj55/MymbwiRIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAQEBQADNEgIECBAgQIAAAQIECBAgQIAAAQIECBAgkF1AAJB9QuojQIAAAQIECBAgQIAAAQIECBAgQIAAAQIBAQFAAM0SAgQIECBAgAABAgQIECBAgAABAgQIECCQXUAAkH1C6iNAgAABAgQIECBAgAABAgQIECBAgAABAgEBAUAAzRICBAgQIECAAAECBAgQIECAAAECBAgQIJBdQACQfULqI0CAAAECBAgQIECAAAECBAgQIECAAAECAYH/AuX7sgv4DBgrAAAAAElFTkSuQmCC',
        form1: {
          form: '65ea3662705068f84a93c781',
          owner: '65ea3601c3792e416cabcb2a',
          roles: [],
          access: [],
          metadata: {
            selectData: {
              form1: {
                data: {
                  select1: {
                    label: 'Sb',
                  },
                },
              },
            },
            timezone: 'America/Chicago',
            offset: -360,
            origin: 'http://localhost:3000',
            referrer: '',
            browserName: 'Netscape',
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            pathName: '/',
            onLine: true,

          },
          data: {
            number: 23,
            checkbox: true,
            selectBoxes1: {
              sbA: false,
              sbB: true,
              sbC: false,
              sbD: false,
            },
            select1: 'sb',
            selectUrl: {
              name: 'Alaska',
              abbreviation: 'AK',
            },
            radio1: 'ra',
            email: 'travis@form.io',
            url: 'google.com',
            phoneNumber: '(234) 234-2342',
            tags: 'test',
            address: {
              address_components: [
                {
                  long_name: '12342',
                  short_name: '12342',
                  types: ['street_number'],
                },
                {
                  long_name: 'Coit Road',
                  short_name: 'Coit Rd',
                  types: ['route'],
                },
                {
                  long_name: 'North Dallas',
                  short_name: 'North Dallas',
                  types: ['neighborhood', 'political'],
                },
                {
                  long_name: 'Dallas',
                  short_name: 'Dallas',
                  types: ['locality', 'political'],
                },
                {
                  long_name: 'Dallas County',
                  short_name: 'Dallas County',
                  types: ['administrative_area_level_2', 'political'],
                },
                {
                  long_name: 'Texas',
                  short_name: 'TX',
                  types: ['administrative_area_level_1', 'political'],
                },
                {
                  long_name: 'United States',
                  short_name: 'US',
                  types: ['country', 'political'],
                },
                {
                  long_name: '75243',
                  short_name: '75243',
                  types: ['postal_code'],
                },
                {
                  long_name: '2308',
                  short_name: '2308',
                  types: ['postal_code_suffix'],
                },
              ],
              formatted_address: '12342 Coit Rd, Dallas, TX 75243, USA',
              geometry: {
                location: {
                  lat: 32.9165814,
                  lng: -96.76889729999999,
                },
                viewport: {
                  south: 32.9151396697085,
                  west: -96.7703730302915,
                  north: 32.9178376302915,
                  east: -96.76767506970849,
                },
              },
              place_id: 'ChIJrbdWEhUgTIYRl5rVJe8Zl6A',
              plus_code: {
                compound_code: 'W68J+JC Dallas, TX, USA',
                global_code: '8645W68J+JC',
              },
              types: ['street_address'],
              formattedPlace: '12342 Coit Rd, Dallas, TX 75243, USA',
            },
            dateTime: '2024-03-14T17:00:00.000Z',
            day: '03/23/2029',
            time: '15:30:00 pm',
            currency: 2,
            signature:
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABgAAAACWCAYAAAAYAUMPAAAAAXNSR0IArs4c6QAAFBBJREFUeF7t3bFuE1kUBuChTk2J8h4gU6ekXInnIAWu7YLUKXbrFJRs5xqLlFugFS9BRZF6V9cro6yJsePjMWfOfCOhFHjunPOdW/n3zDy5u/v6T+cgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIESgk8EQCUmqdmCBAgQIAAAQIECBAgQIAAAQIECBAgQIDASkAAYCMQIECAAAECBAgQIECAAAECBAgQIECAAIGCAgKAgkPVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoKCAAKDgULVEgAABAgQIECBAgAABAgQIECBAgAABAgQEAPYAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKCAAKDhULREgQIAAAQIECBAgQIAAAQIECBAgQIAAAQGAPUCAAAECBAgQIECAAAECBAgQIECAAAECBAoKCAAKDlVLBAgQIECAAAECBAgQIECAAAECBAgQIEBAAGAPECBAgAABAgQIECBAgAABAgQIECBAgACBggICgIJD1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKCggACg4FC1RIAAAQIECBAgQIAAAQIECBAgQIAAAQIEBAD2AAECBAgQIECAAAECBAgQIECAAAECBAgQKCggACg4VC0RIECAAAECBAgQIECAAAECBAgQIECAAAEBgD1AgAABAgQIECBAgAABAgQIECBAgAABAgQKCggACg5VSwQIECBAgAABAgQIECBAgAABAgQIECBAQABgDxAgQIAAAQIECBAgQIAAAQIECBAgQIAAgYICAoCCQ9USAQIECBAgQIAAAQIECBAgQIAAAQIECBAQANgDBAgQIECAAAECBAgQIECAAAECBAgQIECgoIAAoOBQtUSAAAECBAgQIECAAAECBAgQIECAAAECBAQA9gABAgQIECBAgAABAgQIECBAgAABAgQIECgoIAAoOFQtESBAgAABAgQIECBAgAABAgQIECBAgAABAYA9QIAAAQIECBAgQIAAAQIECBAgQIAAAQIECgoIAAoOVUsECBAgQIAAAQIECBAgQIAAAQIECBAgQEAAYA8QIECAAAECBAgQIECAAAECBAgQIECAAIGCAgKAgkPVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoKCAAKDgULVEgAABAgQIECBAgAABAgQIECBAgAABAgQEAPYAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKCAAKDhULREgQIAAAQIECBAgQIAAAQIECBAgQIAAAQGAPUCAAAECBAgQIECAAAECBAgQIECAAAECBAoKCAAKDlVLBAgQIECAAAECBAgQIECAAAECBAgQIEBAAGAPECBAgAABAgQIECBAgAABAgQIECBAgACBggICgIJD1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKCggACg4FC1RIAAAQIECBAgQIAAAQIECBAgQIAAAQIEBAD2AAECBAgQIECAAAECBAgQIECAAAECBAgQKCggACg4VC0RIECAAAECBAgQIECAAAECBAgQIECAAAEBgD1AgAABAgQIECBAgAABAgQIECBAgAABAgQKCggACg5VSwQIECBAgAABAgQIECBAgAABAgQIECBAQABgDxAgQIAAAQIECBAgQIAAAQIECBAgQIAAgYICAoCCQ9USAQIECBAgQIAAAQIECBAgQIAAAQIECBAQANgDBAgQIECAAAECBAgQIECAAAECBAgQIECgoIAAoOBQtUSAAAECBAgQIECAAAECBAgQIECAAAECBAQA9gABAgQIECBAgAABAgQIECBAgAABAgQIECgoIAAoOFQtESBAgAABAgQIECBAgAABAgQIECBAgAABAYA9QIAAAQIECBAgQIAAAQIECBAgQIAAAQIECgoIAAoOVUsECBAgQIAAAQIECBAgQIAAAQIECBAgQEAAYA8QIECAAAECBAgQIECAAAECBAgQIECAAIGCAgKAgkPVEgECBAgQIECAAAECBAgQIECAAAECBAgQEADYAwQIECBAgAABAgQIECBAgAABAgQIECBAoKCAAKDgULVEgAABAgQIECBAgAABAgQIECBAgAABAgQEAPYAAQIECBAgQIAAAQIECBAgQIAAAQIECBAoKCAAKDhULREgQIAAAQIECBAgQIAAAQIECBAgQIAAAQGAPUCAAAECBAgQIECAAAECBAgQIECAAAECBAoKCAAKDlVLBAgQIECAAAECBAgQIECAAAECBAgQIEBAAGAPECBAgAABAgQIECBAgAABAgQIECBAgACBggICgIJD1RIBAgQIECBAgAABAgQIECBAgAABAgQIEBAA2AMECBAgQIAAAQIECBAgQIAAAQIECBAgQKCggACg4FC1RIAAAQIECBAgQIAAAQIECBAgQIAAAQIEBAD2AAECBAgQIECAAAECBAgQIECAAAECBAgQKCggACg4VC0RIECAAAECBAgQIECAAAECBAgQIECAAAEBgD1AgAABAgQIECBAgAABAgQIECBAgAABAgQKCggACg5VSwQIECBAgAABAgQIECBAgAABAgQIECBAQABgD5xMYLn81H38+Kl7+fLF6m87lsvb1d/J5Pnq73R6ebJ6XIgAAQIECBAgQIAAAQIECBAgQIAAAQKVBQQAlaebqLfZ7F03n1/tVdFk8mIVCAgD9uLyIQIECBAgQIAAAQIECBAgQIAAAQIECDwoIACwMU4icHb29KDrrIOAFgo4CBAgQIAAAQIECBAgQIAAAQIECBAgQGB/AQHA/lY+eaBAe/TPxcWrA8/+77QWAEynb1Z/HQQIECBAgAABAgQIECBAgAABAgQIECCwW0AAsNvIJ44g8JhHAP3scoKAIwzDEgQIECBAgAABAgQIECBAgAABAgQIjEJAADCKMedosoUA66O9CHjzaC8Gbi8FbncM7DpaELBYfNj1Mf9PgAABAgQIECBAgAABAgQIECBAgACB0QoIAEY7+tyNt7Dg+vqP7tu3b1sLFQLknqHqCBAgQIAAAQIECBAgQIAAAQIECBD4tQICgF/r7+o7BNrdALPZ1da7As7Pn3VfvvzFkQABAgQIECBAgAABAgQIECBAgAABAgQ2BAQAtsQgBHYFAe1xQF4QPIhRKpIAAQIECBAgQIAAAQIECBAgQIAAgRMJCABOBO0yxxPY9kJhLwg+nrGVCBAgQIAAAQIECBAgQIAAAQIECBAYvoAAYPgzHGUH19e/dzc377vPn//+of+3b9900+nlKF00TYAAAQIECBAgQIAAAQIECBAgQIAAgbWAAMBeGLSAuwEGPT7FEyBAgAABAgQIECBAgAABAgQIECDQo4AAoEdcS59G4GfvB3A3wGlm4CoECBAgQIAAAQIECBAgQIAAAQIECOQTEADkm4mKDhRwN8CBcE4jQIAAAQIECBAgQIAAAQIECBAgQKCkgACg5FjH3dTFxauu3RWweXhJ8Lj3he4JECBAgAABAgQIECBAgAABAgQIjE1AADC2iY+kX48FGsmgtUmAAAECBAgQIECAAAECBAgQIECAwFYBAYDNUVogw2OBWg3L5W23WHwoba05AgQIECBAgAABAgQIECBAgAABAgRyCQgAcs1DNT0JbHssUN8vCW53IrRrt6Pva/VEZ1kCBAgQIECAAAECBAgQIECAAAECBAYqIAAY6OCU/XiBbY8F6vPdAPcDgHYddwE8fm7OIECAAAECBAgQIECAAAECBAgQIEDgMAEBwGFuzhqwwLYgoK9f6J+dPf2udXf3dcBySidAgAABAgQIECBAgAABAgQIECBAYEgCAoAhTUutRxV4KAjo426A+wFAuwOgXcNBgAABAgQIECBAgAABAgQIECBAgACBvgUEAH0LWz+9wENBwDHvBhAApN8CCiRAgAABAgQIECBAgAABAgQIECBQUkAAUHKsmjpEYDZ7183nV99PnUyed4vFn4cs9b9z7r+A+JjBQrgwCxAgQIAAAQIECBAgQIAAAQIECBAgUFpAAFB6vJo7RGAzCIh+ae8OgEOm4BwCBAgQIECAAAECBAgQIECAAAECBKICAoCooPPLCjwUBLRmp9PLvXveXMNLgPem80ECBAgQIECAAAECBAgQIECAAAECBIICAoAgoNNrC2x+gb/u9vz8Wff69W87w4D7v/5vL/9tLwF2ECBAgAABAgQIECBAgAABAgQIECBA4BQCAoBTKLvG4AW2BQHt8UDt2LwroL1Y+Obm/erf+mhf/rcQwEGAAAECBAgQIECAAAECBAgQIECAAIFTCAgATqHsGmUEWhDQvtxfLm9/6Gn95X77/83Dr//LbAGNECBAgAABAgQIECBAgAABAgQIEBiMgABgMKNSaCaBFgS0Yz6/2qssv/7fi8mHCBAgQIAAAQIECBAgQIAAAQIECBA4ooAA4IiYlhqfwD5BQHtM0GNeHDw+RR0TIECAAAECBAgQIECAAAECBAgQINCHgACgD1VrjlJg/egfz/kf5fg1TYAAAQIECBAgQIAAAQIECBAgQCCdgAAg3UgURIAAAQIECBAgQIAAAQIECBAgQIAAAQIE4gICgLihFQgQIECAAAECBAgQIECAAAECBAgQIECAQDoBAUC6kSiIAAECBAgQIECAAAECBAgQIECAAAECBAjEBQQAcUMrECBAgAABAgQIECBAgAABAgQIECBAgACBdAICgHQjURABAgQIECBAgAABAgQIECBAgAABAgQIEIgLCADihlYgQIAAAQIECBAgQIAAAQIECBAgQIAAAQLpBAQA6UaiIAIECBAgQIAAAQIECBAgQIAAAQIECBAgEBcQAMQNrUCAAAECBAgQIECAAAECBAgQIECAAAECBNIJCADSjURBBAgQIECAAAECBAgQIECAAAECBAgQIEAgLiAAiBtagQABAgQIECBAgAABAgQIECBAgAABAgQIpBMQAKQbiYIIECBAgAABAgQIECBAgAABAgQIECBAgEBcQAAQN7QCAQIECBAgQIAAAQIECBAgQIAAAQIECBBIJyAASDcSBREgQIAAAQIECBAgQIAAAQIECBAgQIAAgbiAACBuaAUCBAgQIECAAAECBAgQIECAAAECBAgQIJBOQACQbiQKIkCAAAECBAgQIECAAAECBAgQIECAAAECcQEBQNzQCgQIECBAgAABAgQIECBAgAABAgQIECBAIJ2AACDdSBREgAABAgQIECBAgAABAgQIECBAgAABAgTiAgKAuKEVCBAgQIAAAQIECBAgQIAAAQIECBAgQIBAOgEBQLqRKIgAAQIECBAgQIAAAQIECBAgQIAAAQIECMQFBABxQysQIECAAAECBAgQIECAAAECBAgQIECAAIF0AgKAdCNREAECBAgQIECAAAECBAgQIECAAAECBAgQiAsIAOKGViBAgAABAgQIECBAgAABAgQIECBAgAABAukEBADpRqIgAgQIECBAgAABAgQIECBAgAABAgQIECAQFxAAxA2tQIAAAQIECBAgQIAAAQIECBAgQIAAAQIE0gkIANKNREEECBAgQIAAAQIECBAgQIAAAQIECBAgQCAuIACIG1qBAAECBAgQIECAAAECBAgQIECAAAECBAikExAApBuJgggQIECAAAECBAgQIECAAAECBAgQIECAQFxAABA3tAIBAgQIECBAgAABAgQIECBAgAABAgQIEEgnIABINxIFESBAgAABAgQIECBAgAABAgQIECBAgACBuIAAIG5oBQIECBAgQIAAAQIECBAgQIAAAQIECBAgkE5AAJBuJAoiQIAAAQIECBAgQIAAAQIECBAgQIAAAQJxAQFA3NAKBAgQIECAAAECBAgQIECAAAECBAgQIEAgnYAAIN1IFESAAAECBAgQIECAAAECBAgQIECAAAECBOICAoC4oRUIECBAgAABAgQIECBAgAABAgQIECBAgEA6AQFAupEoiAABAgQIECBAgAABAgQIECBAgAABAgQIxAUEAHFDKxAgQIAAAQIECBAgQIAAAQIECBAgQIAAgXQCAoB0I1EQAQIECBAgQIAAAQIECBAgQIAAAQIECBCICwgA4oZWIECAAAECBAgQIECAAAECBAgQIECAAAEC6QQEAOlGoiACBAgQIECAAAECBAgQIECAAAECBAgQIBAXEADEDa1AgAABAgQIECBAgAABAgQIECBAgAABAgTSCQgA0o1EQQQIECBAgAABAgQIECBAgAABAgQIECBAIC4gAIgbWoEAAQIECBAgQIAAAQIECBAgQIAAAQIECKQTEACkG4mCCBAgQIAAAQIECBAgQIAAAQIECBAgQIBAXEAAEDe0AgECBAgQIECAAAECBAgQIECAAAECBAgQSCcgAEg3EgURIECAAAECBAgQIECAAAECBAgQIECAAIG4gAAgbmgFAgQIECBAgAABAgQIECBAgAABAgQIECCQTkAAkG4kCiJAgAABAgQIECBAgAABAgQIECBAgAABAnEBAUDc0AoECBAgQIAAAQIECBAgQIAAAQIECBAgQCCdgAAg3UgURIAAAQIECBAgQIAAAQIECBAgQIAAAQIE4gICgLihFQgQIECAAAECBAgQIECAAAECBAgQIECAQDoBAUC6kSiIAAECBAgQIECAAAECBAgQIECAAAECBAjEBQQAcUMrECBAgAABAgQIECBAgAABAgQIECBAgACBdAICgHQjURABAgQIECBAgAABAgQIECBAgAABAgQIEIgL/AseLFj8GyK16AAAAABJRU5ErkJggg==',
            dataGrid: [
              {
                checkbox: true,
                select: '',
                radio1: 'rb',
              },
            ],
          },
          _id: '65ea36dd705068f84a93c9c3',
          _fvid: 1,
          project: '65ea3620705068f84a93c694',
          state: 'submitted',
          externalIds: [],
          created: '2024-03-07T21:51:25.110Z',
          modified: '2024-03-07T21:51:25.110Z',
        },
        parentNumber: 234,
      },
      owner: '65ea3601c3792e416cabcb2a',
      access: [],

      _vnote: '',
      state: 'submitted',
      form: '65ea368b705068f84a93c87a',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    context.processors = ProcessTargets.evaluator;
    processSync(context);
    console.log(context.scope.errors);

    assert.equal(context.scope.errors.length, 0);
  });
  it('should remove submission data not in a nested form definition', async function () {
    const form = {
      _id: {},
      title: 'parent',
      name: 'parent',
      type: 'form',
      components: [
        {
          type: 'checkbox',
          label: 'A',
          key: 'A',
          input: true,
        },
        {
          type: 'checkbox',
          label: 'B',
          key: 'B',
          input: true,
        },
        {
          key: 'child',
          label: 'child',
          form: 'child form',
          type: 'form',
          input: true,
          reference: false,
          clearOnHide: false,
          components: [
            {
              label: 'Input',
              key: 'input',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };
    const submission = {
      data: {
        A: true,
        B: true,
        child: {
          _id: 'submission id',
          data: {
            input: 'test',
            invalid: 'invalid submission data',
          },
        },
      },
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.include({
      child: { _id: 'submission id', data: { input: 'test' } },
    });
    expect(context.data.child.data).to.not.have.property('invalid');
  });
  it('Should process nested form data correctly', async () => {
    const submission = {
      data: {
        submit: true,
        child: {
          data: {
            input: '4',
            output: 200,
          },
        },
      },
      owner: '65df88d8a98df60a25008300',
      access: [],
      metadata: {
        headers: {
          'accept-language': 'en-US,en',
          'cache-control': 'no-cache',
          connection: 'keep-alive',
          origin: 'http://localhost:3000',
          pragma: 'no-cache',
          referer: 'http://localhost:3000/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'sec-gpc': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          accept: 'application/json',
          'content-type': 'application/json',
          'sec-ch-ua':
            '"Chromium";v="122", "Not(A:Brand";v="24", "Brave";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          host: 'localhost:3000',
          'accept-encoding': 'gzip, deflate, br',
          'content-length': '172',
        },
      },
      form: '65e74c65ef4451c9ede341e3',
    };
    const form = {
      title: 'Parent Form',
      name: 'parentForm',
      path: 'parentform',
      type: 'form',
      display: 'form',
      tags: [],
      deleted: null,
      access: [
        {
          type: 'create_own',
          roles: [],
        },
        {
          type: 'create_all',
          roles: [],
        },
        {
          type: 'read_own',
          roles: [],
        },
        {
          type: 'read_all',
          roles: [{}, {}, {}],
        },
        {
          type: 'update_own',
          roles: [],
        },
        {
          type: 'update_all',
          roles: [],
        },
        {
          type: 'delete_own',
          roles: [],
        },
        {
          type: 'delete_all',
          roles: [],
        },
        {
          type: 'team_read',
          roles: [],
        },
        {
          type: 'team_write',
          roles: [],
        },
        {
          type: 'team_admin',
          roles: [],
        },
      ],
      submissionAccess: [
        {
          type: 'create_own',
          roles: [],
        },
        {
          type: 'create_all',
          roles: [],
        },
        {
          type: 'read_own',
          roles: [],
        },
        {
          type: 'read_all',
          roles: [],
        },
        {
          type: 'update_own',
          roles: [],
        },
        {
          type: 'update_all',
          roles: [],
        },
        {
          type: 'delete_own',
          roles: [],
        },
        {
          type: 'delete_all',
          roles: [],
        },
        {
          type: 'team_read',
          roles: [],
        },
        {
          type: 'team_write',
          roles: [],
        },
        {
          type: 'team_admin',
          roles: [],
        },
      ],
      owner: {},
      components: [
        {
          label: 'Child',
          tableView: true,
          form: '65e74c2aef4451c9ede34105',
          useOriginalRevision: false,
          reference: false,
          key: 'child',
          type: 'form',
          input: true,
          components: [
            {
              label: 'Input',
              applyMaskOn: 'change',
              tableView: true,
              key: 'input',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Output',
              applyMaskOn: 'change',
              disabled: true,
              tableView: true,
              calculateValue: 'value = parseInt(data.input) * 5;',
              calculateServer: true,
              key: 'output',
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
      settings: {},
      properties: {},
      project: {},
      controller: '',
      revisions: '',
      submissionRevisions: '',
      _vid: 0,
      created: '2024-03-05T16:46:29.859Z',
      modified: '2024-03-05T18:50:08.638Z',
      machineName: 'tzcuqutdtlpgicr:parentForm',
      __v: 1,
      config: {
        appUrl: 'http://localhost:3000/tzcuqutdtlpgicr',
      },
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data.child.data.output).to.equal(20);
  });

  it('Should process nested data correctly.', async () => {
    const form = {
      _id: {},
      title: 'parent',
      name: 'parent',
      path: 'parent',
      type: 'form',
      display: 'form',
      tags: [],
      deleted: null,
      access: [
        {
          type: 'read_all',
          roles: [{}, {}, {}],
        },
      ],
      submissionAccess: [],
      owner: {},
      components: [
        {
          type: 'checkbox',
          label: 'Show A',
          key: 'showA',
          input: true,
        },
        {
          type: 'checkbox',
          label: 'Show B',
          key: 'showB',
          input: true,
        },
        {
          type: 'checkbox',
          label: 'Show C',
          key: 'showC',
          input: true,
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12d2',
          label: 'Child A',
          key: 'childA',
          input: true,
          conditional: {
            show: true,
            when: 'showA',
            eq: true,
          },
          components: [
            {
              type: 'textfield',
              label: 'A',
              key: 'a',
              validate: {
                required: true,
              },
              input: true,
            },
            {
              type: 'textfield',
              label: 'B',
              key: 'b',
              input: true,
            },
          ],
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12e0',
          label: 'Child B',
          key: 'childB',
          input: true,
          conditional: {
            show: true,
            when: 'showB',
            eq: true,
          },
          components: [
            {
              type: 'textfield',
              label: 'C',
              key: 'c',
              input: true,
              validate: {
                required: true,
              },
            },
            {
              type: 'textfield',
              label: 'D',
              key: 'd',
              input: true,
            },
          ],
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12ee',
          label: 'Child C',
          key: 'childC',
          conditional: {
            show: true,
            when: 'showC',
            eq: true,
          },
          input: true,
          components: [
            {
              type: 'textfield',
              label: 'E',
              key: 'e',
              input: true,
              validate: {
                required: true,
              },
            },
            {
              type: 'textfield',
              label: 'F',
              key: 'f',
              input: true,
            },
          ],
        },
      ],
      created: '2024-03-06T14:06:39.724Z',
      modified: '2024-03-06T14:06:39.726Z',
      machineName: 'parent',
      __v: 0,
    };
    const submission = {
      data: {
        showA: true,
        showB: true,
        showC: true,
        childA: {
          data: {
            a: 'One',
            b: 'Two',
          },
        },
        childB: {
          data: {
            c: 'Three',
            d: 'Four',
          },
        },
        childC: {
          data: {
            e: 'Five',
            f: 'Six',
          },
        },
      },
      owner: '65e87843c5dacf667eeeecc1',
      access: [],
      metadata: {
        headers: {
          host: '127.0.0.1:64851',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
          'content-length': '173',
          connection: 'close',
        },
      },
      form: '65e8786fc5dacf667eef12fc',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    context.processors = ProcessTargets.evaluator;
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
    assert.equal(context.data.showA, true);
    assert.equal(context.data.showB, true);
    assert.equal(context.data.showC, true);
    assert.deepEqual(context.data.childA.data, {
      a: 'One',
      b: 'Two',
    });
    assert.deepEqual(context.data.childB.data, {
      c: 'Three',
      d: 'Four',
    });
    assert.deepEqual(context.data.childC.data, {
      e: 'Five',
      f: 'Six',
    });
  });

  it('Should allow the submission to go through if the subform is conditionally hidden', async () => {
    const form = {
      _id: {},
      title: 'parent',
      name: 'parent',
      path: 'parent',
      type: 'form',
      display: 'form',
      tags: [],
      deleted: null,
      access: [
        {
          type: 'read_all',
          roles: [{}, {}, {}],
        },
      ],
      submissionAccess: [],
      owner: {},
      components: [
        {
          type: 'checkbox',
          label: 'Show A',
          key: 'showA',
          input: true,
        },
        {
          type: 'checkbox',
          label: 'Show B',
          key: 'showB',
          input: true,
        },
        {
          type: 'checkbox',
          label: 'Show C',
          key: 'showC',
          input: true,
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12d2',
          label: 'Child A',
          key: 'childA',
          input: true,
          conditional: {
            show: true,
            when: 'showA',
            eq: true,
          },
          components: [
            {
              type: 'textfield',
              label: 'A',
              key: 'a',
              validate: {
                required: true,
              },
              input: true,
            },
            {
              type: 'textfield',
              label: 'B',
              key: 'b',
              input: true,
            },
          ],
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12e0',
          label: 'Child B',
          key: 'childB',
          input: true,
          conditional: {
            show: true,
            when: 'showB',
            eq: true,
          },
          components: [
            {
              type: 'textfield',
              label: 'C',
              key: 'c',
              input: true,
              validate: {
                required: true,
              },
            },
            {
              type: 'textfield',
              label: 'D',
              key: 'd',
              input: true,
            },
          ],
        },
        {
          type: 'form',
          form: '65e8786fc5dacf667eef12ee',
          label: 'Child C',
          key: 'childC',
          conditional: {
            show: true,
            when: 'showC',
            eq: true,
          },
          input: true,
          components: [
            {
              type: 'textfield',
              label: 'E',
              key: 'e',
              input: true,
              validate: {
                required: true,
              },
            },
            {
              type: 'textfield',
              label: 'F',
              key: 'f',
              input: true,
            },
          ],
        },
      ],
      created: '2024-03-06T14:06:39.724Z',
      modified: '2024-03-06T14:06:39.726Z',
      machineName: 'parent',
      __v: 0,
    };
    const submission = {
      data: {
        showA: false,
        showB: true,
        showC: true,
        childB: {
          data: {
            c: 'Three',
            d: 'Four',
          },
        },
        childC: {
          data: {
            e: 'Five',
            f: 'Six',
          },
        },
      },
      owner: '65e87843c5dacf667eeeecc1',
      access: [],
      metadata: {
        headers: {
          host: '127.0.0.1:64851',
          'accept-encoding': 'gzip, deflate',
          'content-type': 'application/json',
          'content-length': '173',
          connection: 'close',
        },
      },
      form: '65e8786fc5dacf667eef12fc',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    context.processors = ProcessTargets.evaluator;
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
    assert.equal(context.data.showA, false);
    assert.equal(context.data.showB, true);
    assert.equal(context.data.showC, true);
    assert(
      !context.data.hasOwnProperty('childA'),
      'The childA form should not be present.'
    );
    assert.deepEqual(context.data.childB.data, {
      c: 'Three',
      d: 'Four',
    });
    assert.deepEqual(context.data.childC.data, {
      e: 'Five',
      f: 'Six',
    });
  });

  it('Should process data within a fieldset properly.', async () => {
    const submission = {
      data: {
        firstName: 'Joe',
        lastName: 'Smith',
      },
    };
    const form = {
      components: [
        {
          type: 'fieldset',
          key: 'name',
          input: false,
          components: [
            {
              type: 'textfield',
              key: 'firstName',
              input: true,
            },
            {
              type: 'textfield',
              key: 'lastName',
              input: true,
            },
          ],
        },
      ],
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data.firstName).to.equal('Joe');
    expect(context.data.lastName).to.equal('Smith');
  });

  it('Requires a conditionally visible field', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: true,
          tableView: true,
          inputType: 'text',
          inputMask: '',
          label: 'Required Field',
          key: 'requiredField',
          placeholder: '',
          prefix: '',
          suffix: '',
          multiple: false,
          defaultValue: '',
          protected: false,
          unique: false,
          persistent: true,
          validate: {
            required: true,
            minLength: '',
            maxLength: '',
            pattern: '',
            custom: '',
            customPrivate: false,
          },
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
          type: 'textfield',
        },
      ],
    };

    const submission = { data: { selector: 'two' } };
    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 1);
    assert.equal(context.scope.errors[0].errorKeyOrMessage, 'required');
    assert.equal(context.scope.errors[0].context.path, 'requiredField');
  });

  it("Doesn't require a conditionally hidden field", async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: true,
          tableView: true,
          inputType: 'text',
          inputMask: '',
          label: 'Required Field',
          key: 'requiredField',
          placeholder: '',
          prefix: '',
          suffix: '',
          multiple: false,
          defaultValue: '',
          protected: false,
          unique: false,
          persistent: true,
          validate: {
            required: true,
            minLength: '',
            maxLength: '',
            pattern: '',
            custom: '',
            customPrivate: false,
          },
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
          type: 'textfield',
        },
      ],
    };

    const submission = {
      data: {
        selector: 'one',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Allows a conditionally required field', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: true,
          tableView: true,
          inputType: 'text',
          inputMask: '',
          label: 'Required Field',
          key: 'requiredField',
          placeholder: '',
          prefix: '',
          suffix: '',
          multiple: false,
          defaultValue: '',
          protected: false,
          unique: false,
          persistent: true,
          validate: {
            required: true,
            minLength: '',
            maxLength: '',
            pattern: '',
            custom: '',
            customPrivate: false,
          },
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
          type: 'textfield',
        },
      ],
    };

    const submission = {
      data: {
        selector: 'two',
        requiredField: 'Has a value',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Ignores conditionally hidden fields', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: true,
          tableView: true,
          inputType: 'text',
          inputMask: '',
          label: 'Required Field',
          key: 'requiredField',
          placeholder: '',
          prefix: '',
          suffix: '',
          multiple: false,
          defaultValue: '',
          protected: false,
          unique: false,
          persistent: true,
          validate: {
            required: true,
            minLength: '',
            maxLength: '',
            pattern: '',
            custom: '',
            customPrivate: false,
          },
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
          type: 'textfield',
        },
      ],
    };

    const submission = {
      data: {
        selector: 'one',
        requiredField: 'Has a value',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.deepEqual(context.data, { selector: 'one' });
    assert.equal(context.scope.errors.length, 0);
  });

  it('Requires a conditionally visible field in a panel', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: false,
          title: 'Panel',
          theme: 'default',
          components: [
            {
              input: true,
              tableView: true,
              inputType: 'text',
              inputMask: '',
              label: 'Required Field',
              key: 'requiredField',
              placeholder: '',
              prefix: '',
              suffix: '',
              multiple: false,
              defaultValue: '',
              protected: false,
              unique: false,
              persistent: true,
              validate: {
                required: true,
                minLength: '',
                maxLength: '',
                pattern: '',
                custom: '',
                customPrivate: false,
              },
              conditional: {
                show: null,
                when: null,
                eq: '',
              },
              type: 'textfield',
            },
          ],
          type: 'panel',
          key: 'panel',
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
        },
      ],
    };

    const submission = {
      data: {
        selector: 'two',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 1);
    assert.equal(context.scope.errors[0].errorKeyOrMessage, 'required');
    assert.equal(context.scope.errors[0].context.path, 'requiredField');
  });

  it("Doesn't require a conditionally hidden field in a panel", async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: false,
          title: 'Panel',
          theme: 'default',
          components: [
            {
              input: true,
              tableView: true,
              inputType: 'text',
              inputMask: '',
              label: 'Required Field',
              key: 'requiredField',
              placeholder: '',
              prefix: '',
              suffix: '',
              multiple: false,
              defaultValue: '',
              protected: false,
              unique: false,
              persistent: true,
              validate: {
                required: true,
                minLength: '',
                maxLength: '',
                pattern: '',
                custom: '',
                customPrivate: false,
              },
              conditional: {
                show: null,
                when: null,
                eq: '',
              },
              type: 'textfield',
            },
          ],
          type: 'panel',
          key: 'panel',
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
        },
      ],
    };

    const submission = {
      data: {
        selector: 'one',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Allows a conditionally required field in a panel', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: false,
          title: 'Panel',
          theme: 'default',
          components: [
            {
              input: true,
              tableView: true,
              inputType: 'text',
              inputMask: '',
              label: 'Required Field',
              key: 'requiredField',
              placeholder: '',
              prefix: '',
              suffix: '',
              multiple: false,
              defaultValue: '',
              protected: false,
              unique: false,
              persistent: true,
              validate: {
                required: true,
                minLength: '',
                maxLength: '',
                pattern: '',
                custom: '',
                customPrivate: false,
              },
              conditional: {
                show: null,
                when: null,
                eq: '',
              },
              type: 'textfield',
            },
          ],
          type: 'panel',
          key: 'panel',
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
        },
      ],
    };

    const submission = {
      data: {
        selector: 'two',
        requiredField: 'Has a value',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Ignores conditionally hidden fields in a panel', async () => {
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'radio',
          label: 'Selector',
          key: 'selector',
          values: [
            {
              value: 'one',
              label: 'One',
            },
            {
              value: 'two',
              label: 'Two',
            },
          ],
          defaultValue: '',
          protected: false,
          persistent: true,
          validate: {
            required: false,
            custom: '',
            customPrivate: false,
          },
          type: 'radio',
          conditional: {
            show: '',
            when: null,
            eq: '',
          },
        },
        {
          input: false,
          title: 'Panel',
          theme: 'default',
          components: [
            {
              input: true,
              tableView: true,
              inputType: 'text',
              inputMask: '',
              label: 'Required Field',
              key: 'requiredField',
              placeholder: '',
              prefix: '',
              suffix: '',
              multiple: false,
              defaultValue: '',
              protected: false,
              unique: false,
              persistent: true,
              validate: {
                required: true,
                minLength: '',
                maxLength: '',
                pattern: '',
                custom: '',
                customPrivate: false,
              },
              conditional: {
                show: null,
                when: null,
                eq: '',
              },
              type: 'textfield',
            },
          ],
          type: 'panel',
          key: 'panel',
          conditional: {
            show: 'true',
            when: 'selector',
            eq: 'two',
          },
        },
      ],
    };

    const submission = {
      data: {
        selector: 'one',
        requiredField: 'Has a value',
      },
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.deepEqual(context.data, { selector: 'one' });
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should not include submission data for conditionally hidden fields', async () => {
    const form = {
      display: 'form',
      components: [
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
          conditional: {
            show: false,
            conjunction: 'all',
            conditions: [
              {
                component: 'textField',
                operator: 'isEmpty',
              },
            ],
          },
        },
      ],
    };

    const submission = {
      data: {
        textField: '',
        textArea: 'should not be in submission',
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({ textField: '' });
  });

  it('Should not include submission data for logically hidden fields', async () => {
    const form = {
      display: 'form',
      components: [
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
          logic: [
            {
              name: 'Hide When Empty',
              trigger: {
                type: 'simple' as const,
                simple: {
                  show: true,
                  conjunction: 'all',
                  conditions: [
                    {
                      component: 'textField',
                      operator: 'isEmpty',
                    },
                  ],
                },
              },
              actions: [
                {
                  name: 'Hide',
                  type: 'property' as const,
                  property: {
                    label: 'Hidden',
                    value: 'hidden',
                    type: 'boolean' as const,
                  },
                  state: true,
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        textField: '',
        textArea: 'should not be in submission',
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({ textField: '' });
  });

  it('Should allow conditionally hidden text fields within DataGrid and EditGrids', async () => {
    const form = {
      display: 'form',
      components: [
        {
          label: 'Edit Grid',
          tableView: false,
          rowDrafts: false,
          key: 'editGrid',
          type: 'editgrid',
          displayAsTable: false,
          input: true,
          components: [
            {
              label: 'Select',
              widget: 'choicesjs',
              tableView: true,
              data: {
                values: [
                  {
                    label: 'Action1',
                    value: 'action1',
                  },
                  {
                    label: 'Custom',
                    value: 'custom',
                  },
                ],
              },
              key: 'select',
              type: 'select',
              input: true,
            },
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'editGrid.select',
                    operator: 'isEqual',
                    value: 'custom',
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
          ],
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

    const submission = {
      data: {
        editGrid: [
          {
            select: 'action1',
          },
          {
            select: 'custom',
            textField: 'TEST',
          },
        ],
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      editGrid: [
        {
          select: 'action1',
        },
        {
          select: 'custom',
          textField: 'TEST',
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data', async () => {
    const form = {
      display: 'form',
      components: [
        {
          label: 'Select',
          widget: 'choicesjs',
          tableView: true,
          data: {
            values: [
              {
                label: 'Action1',
                value: 'action1',
              },
              {
                label: 'Custom',
                value: 'custom',
              },
            ],
          },
          key: 'select',
          type: 'select',
          input: true,
        },
        {
          label: 'Edit Grid',
          tableView: false,
          rowDrafts: false,
          key: 'editGrid',
          type: 'editgrid',
          displayAsTable: false,
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'select',
                    operator: 'isEqual',
                    value: 'custom',
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
          ],
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

    const submission = {
      data: {
        select: 'custom',
        editGrid: [
          {
            textField: 'TEST',
          },
        ],
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      select: 'custom',
      editGrid: [
        {
          textField: 'TEST',
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data with nested structures', async () => {
    const form = {
      display: 'form',
      components: [
        {
          key: 'container',
          type: 'container',
          components: [
            {
              label: 'Select',
              widget: 'choicesjs',
              tableView: true,
              data: {
                values: [
                  {
                    label: 'Action1',
                    value: 'action1',
                  },
                  {
                    label: 'Custom',
                    value: 'custom',
                  },
                ],
              },
              key: 'select',
              type: 'select',
              input: true,
            },
          ],
          input: true
        },
        {
          label: 'Edit Grid',
          tableView: false,
          rowDrafts: false,
          key: 'editGrid',
          type: 'editgrid',
          displayAsTable: false,
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'container.select',
                    operator: 'isEqual',
                    value: 'custom',
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
          ],
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

    const submission = {
      data: {
        container: {
          select: 'custom',
        },
        editGrid: [
          {
            textField: 'TEST',
          },
        ],
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      container: {
        select: 'custom',
      },
      editGrid: [
        {
          textField: 'TEST',
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data, with co-located component keys in the row that are not targets of conditions', async () => {
    const form = {
      display: 'form',
      components: [
        {
          label: 'Select',
          widget: 'choicesjs',
          tableView: true,
          data: {
            values: [
              {
                label: 'Action1',
                value: 'action1',
              },
              {
                label: 'Custom',
                value: 'custom',
              },
            ],
          },
          key: 'select',
          type: 'select',
          input: true,
        },
        {
          label: 'Edit Grid',
          tableView: false,
          rowDrafts: false,
          key: 'editGrid',
          type: 'editgrid',
          displayAsTable: false,
          input: true,
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              key: 'textField',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'select',
                    operator: 'isEqual',
                    value: 'custom',
                  },
                ],
              },
              type: 'textfield',
              input: true,
            },
            {
              label: 'Select',
              widget: 'choicesjs',
              tableView: true,
              data: {
                values: [
                  {
                    label: 'Action1',
                    value: 'action1',
                  },
                  {
                    label: 'Custom',
                    value: 'custom',
                  },
                ],
              },
              key: 'select',
              type: 'select',
              input: true,
            },
          ]
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

    const submission = {
      data: {
        select: 'custom',
        editGrid: [
          {
            textField: 'TEST',
            select: 'action1'
          },
        ],
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      select: 'custom',
      editGrid: [
        {
          textField: 'TEST',
          select: 'action1'
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data, with nested and co-located component keys in the row that are not targets of conditions', async () => {
    const form = {
      display: 'form',
      components: [
        {
          type: 'container',
          key: 'container',
          input: true,
          components: [
            {
              label: 'Select',
              widget: 'choicesjs',
              tableView: true,
              data: {
                values: [
                  {
                    label: 'Action1',
                    value: 'action1',
                  },
                  {
                    label: 'Custom',
                    value: 'custom',
                  },
                ],
              },
              key: 'select',
              type: 'select',
              input: true,
            },
            {
              label: 'Edit Grid',
              tableView: false,
              rowDrafts: false,
              key: 'editGrid',
              type: 'editgrid',
              displayAsTable: false,
              input: true,
              components: [
                {
                  label: 'Text Field',
                  applyMaskOn: 'change',
                  tableView: true,
                  key: 'textField',
                  conditional: {
                    show: true,
                    conjunction: 'all',
                    conditions: [
                      {
                        component: 'container.select',
                        operator: 'isEqual',
                        value: 'custom',
                      },
                    ],
                  },
                  type: 'textfield',
                  input: true,
                },
                {
                  label: 'Select',
                  widget: 'choicesjs',
                  tableView: true,
                  data: {
                    values: [
                      {
                        label: 'Action1',
                        value: 'action1',
                      },
                      {
                        label: 'Custom',
                        value: 'custom',
                      },
                    ],
                  },
                  key: 'select',
                  type: 'select',
                  input: true,
                },
              ]
            },
          ],
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

    const submission = {
      data: {
        container: {
          select: 'custom',
          editGrid: [
            {
              textField: 'TEST',
              select: 'action1'
            },
          ],
        }
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      container: {
        select: 'custom',
        editGrid: [
          {
            textField: 'TEST',
            select: 'action1'
          },
        ],
      }
    });
  });

  it('Should include submission data for logically visible fields', async () => {
    const form = {
      display: 'form',
      components: [
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
          hidden: true,
          logic: [
            {
              name: 'Show When Not Empty',
              trigger: {
                type: 'simple' as const,
                simple: {
                  show: true,
                  conjunction: 'all',
                  conditions: [
                    {
                      component: 'textField',
                      operator: 'isNotEmpty',
                    },
                  ],
                },
              },
              actions: [
                {
                  name: 'Show',
                  type: 'property' as const,
                  property: {
                    label: 'Hidden',
                    value: 'hidden',
                    type: 'boolean' as const,
                  },
                  state: false,
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        textField: 'not empty',
        textArea: 'should be conditionally visible',
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect((context.scope as any).conditionals).to.deep.equal([{
      path: 'textArea',
      conditionallyHidden: false,
    }]);
    expect(context.data).to.deep.equal({
      textArea: 'should be conditionally visible',
      textField: 'not empty',
    });
  });

  it('Should not filter a simple datamap compoennt', async () => {
    const form = {
      display: 'form',
      components: [
        {
          label: "Data Map",
          tableView: false,
          validateWhenHidden: false,
          key: "dataMap",
          type: "datamap",
          path: "dataMap",
          input: true,
          valueComponent: {
            type: "textfield",
            key: "value",
            label: "Value",
            input: true,
            hideLabel: true,
            tableView: true,
          },
        }
      ]
    };
    const submission = {
      data: {
        dataMap: {
          key1: "value1",
          key2: "value2"
        }
      }
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.evaluator,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      dataMap: {
        key1: "value1",
        key2: "value2"
      }
    });
  });

  it('Should allow the submission to go through without errors if there is no the subform reference value', async () => {
    const form =  {
      _id: '66bc5cff7ca1729623a182db',
      title: 'form2',
      name: 'form2',
      path: 'form2',
      type: 'resource',
      display: 'form',
      owner: '637b2e6b48c1227e60b1f910',
      components: [
        {
          label: 'Text Field - form2',
          applyMaskOn: 'change',
          tableView: true,
          validate: { required: true },
          validateWhenHidden: false,
          key: 'textFieldForm2',
          type: 'textfield',
          input: true,
        },
        {
          label: 'Form',
          tableView: true,
          form: '66bc5ccd7ca1729623a18063',
          useOriginalRevision: false,
          key: 'form',
          type: 'form',
          input: true,
          components: [
            {
              label: 'Text Field form1',
              applyMaskOn: 'change',
              tableView: true,
              validate: { required: true },
              validateWhenHidden: false,
              key: 'textFieldForm1',
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
      project: '669e1c67a40e327e67e7ce55',
      _vid: 0,
      esign: {},
      created: '2024-08-14T07:30:07.953Z',
      modified: '2024-08-14T10:09:13.201Z',
      machineName: 'qzdhayddccjauyr:form2',
      __v: 1,
    };

    const submission = {
      data: { textFieldForm2: '1', form: { _id: '66c455fc0f00757fd4b0e79b' } },
      owner: '637b2e6b48c1227e60b1f910',
      access: [],
      _fvid: 0,
      state: 'submitted',
      _id: '66c455fc0f00757fd4b0e79d',
      form: '66bc5cff7ca1729623a182db',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    context.processors = ProcessTargets.evaluator;
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
    assert.deepEqual(context.data.form, { _id: '66c455fc0f00757fd4b0e79b', data: {} })
  });

  it('Should not hide other components data from submission when address component is filled out', async () => {
    const {form, submission} = addressComponentWithOtherCondComponents
    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: ProcessTargets.submission,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    context.processors = ProcessTargets.evaluator;
    processSync(context);
    expect(context.submission.data.number).to.be.equal(1);
    expect(context.submission.data.textField).to.be.equal('some text');
  });

  describe('Required component validation in nested form in DataGrid/EditGrid', () => {
    const nestedForm = {
      key: 'form',
      type: 'form',
      input: true,
      components: [
        {
          key: 'textField',
          type: 'textfield',
          validate: {
            required: true,
          },
          input: true,
        },
      ],
    };

    describe('For DataGrid:', () => {
      const components = [
        {
          key: 'dataGrid',
          type: 'datagrid',
          input: true,
          components: [nestedForm],
        },
      ];
      it('Should validate required component when it is filled out', async () => {
        const submission = {
          data: {
            dataGrid: [
              {
                form: {
                  data: {
                    textField: 'test',
                    invalidField: 'bad',
                  },
                },
              },
              {
                invalidDataGridField: 'wrong',
              },
            ],
          },
        };

        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: ProcessTargets.submission,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        const errors = (context.scope as ValidationScope).errors;
        expect(context.data).to.deep.equal({
          dataGrid: [{ form: { data: { textField: 'test' } } }],
        });
        expect((context.scope as ValidationScope).errors).to.have.length(0);
        expect;
      });
      it('Should not validate required component when it is not filled out', async () => {
        const submission = {
          data: {
            dataGrid: [
              {
                form: {
                  data: {
                    textField: '',
                  },
                },
              },
            ],
          },
        };

        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: ProcessTargets.submission,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        expect((context.scope as ValidationScope).errors).to.have.length(1);
      });
    });

    it('Should not return fields from conditionally hidden containers, clearOnHide = true', async () => {
      const { form, submission } = clearOnHideWithCustomCondition;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);


      expect(context.data).to.deep.equal({
        candidates:[{candidate:{data:{}}}],
        submit: true
      });
    });

    it('Should skip child validation with conditional', async () => {
      const { form, submission } = skipValidForConditionallyHiddenComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should skip child validation with hidden parent component', async () => {
      const { form, submission } = skipValidWithHiddenParentComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      await process(context);
      context.processors = ProcessTargets.evaluator;
      await process(context);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should skip child validation with logic', async () => {
      const { form, submission } = skipValidForLogicallyHiddenComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context as any);
      context.processors = ProcessTargets.evaluator;
      processSync(context as any);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should not return fields from conditionally hidden containers, clearOnHide = false', async () => {
      const { form, submission } = clearOnHideWithCustomCondition;
      const containerComponent = getComponent(form.components, 'section6') as ContainerComponent;
      containerComponent.clearOnHide = false;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);

      expect(context.data).to.deep.equal({
        candidates:[{candidate:{data:{section6:{}}}}],
        submit: true
      });
    });

    it('Should not return fields from hidden containers, clearOnHide = false', async () => {
      const { form, submission } = clearOnHideWithHiddenParent;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);

      expect(context.data).to.deep.equal({
        candidates:[{candidate:{data:{section6:{}}}}],
        submit: true
      });
    });

    it('Should not return fields from hidden containers, clearOnHide = true', async () => {
      const { form, submission } = clearOnHideWithHiddenParent;
      const containerComponent = getComponent(form.components, 'section6') as ContainerComponent;
      containerComponent.clearOnHide = true;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);

      expect(context.data).to.deep.equal({
        candidates:[{candidate:{data:{section6:{}}}}],
        submit: true
      });
    });

    it('Should validate when all child components are empty in required Data Grid', async () => {
      const { form, submission } = forDataGridRequired;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: ProcessTargets.submission,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      context.processors = ProcessTargets.evaluator;
      processSync(context);

      expect((context.scope as ValidationScope).errors).to.have.length(1);
    });

    describe('For EditGrid:', () => {
      const components = [
        {
          key: 'editGrid',
          type: 'editgrid',
          input: true,
          components: [nestedForm],
        },
      ];
      it('should return empty array when no data is provided', async () => {
        const submission = {
          data: {
            editGrid: [],
          },
        };
        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: ProcessTargets.submission,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        expect(context.data).to.deep.equal({ editGrid: [] });

      })
      it('Should validate required component when it is filled out', async () => {
        const submission = {
          data: {
            editGrid: [
              {
                form: {
                  data: {
                    textField: 'test',
                    invalidField: 'bad',
                  },

                },
              },
              {
                invalidDataGridField: 'wrong',
              },
            ],
          },
        };

        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: ProcessTargets.submission,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        console.log(JSON.stringify(context.data, null, 2));

        expect((context.scope as ValidationScope).errors).to.have.length(0);
         expect(context.data).to.deep.equal({
          editGrid: [{ form: { data: { textField: 'test' } } }],
        });
      });
      it('Should not validate required component when it is not filled out', async () => {
        const submission = {
          data: {
            editGrid: [
              {
                form: {
                  data: {
                    textField: '',
                  },
                },
              },
            ],
          },
        };

        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: ProcessTargets.submission,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        context.processors = ProcessTargets.evaluator;
        processSync(context);
        expect((context.scope as ValidationScope).errors).to.have.length(1);
      });

    });
  });

  /*
          it('Should not clearOnHide when set to false', async () => {
            var components = [
              {
                "input": true,
                "tableView": true,
                "inputType": "radio",
                "label": "Selector",
                "key": "selector",
                "values": [
                  {
                    "value": "one",
                    "label": "One"
                  },
                  {
                    "value": "two",
                    "label": "Two"
                  }
                ],
                "defaultValue": "",
                "protected": false,
                "persistent": true,
                "validate": {
                  "required": false,
                  "custom": "",
                  "customPrivate": false
                },
                "type": "radio",
                "conditional": {
                  "show": "",
                  "when": null,
                  "eq": ""
                }
              },
              {
                "input": false,
                "title": "Panel",
                "theme": "default",
                "components": [
                  {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "No Clear Field",
                    "key": "noClear",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "clearOnHide": false,
                    "validate": {
                      "required": false,
                      "minLength": "",
                      "maxLength": "",
                      "pattern": "",
                      "custom": "",
                      "customPrivate": false
                    },
                    "conditional": {
                      "show": null,
                      "when": null,
                      "eq": ""
                    },
                    "type": "textfield"
                  }
                ],
                "type": "panel",
                "key": "panel",
                "conditional": {
                  "show": "true",
                  "when": "selector",
                  "eq": "two"
                }
              }
            ];

            helper
              .form('test', components)
              .submission({
                selector: 'one',
                noClear: 'testing'
              })
              .execute(function(err) {
                if (err) {
                  return done(err);
                }

                var submission = helper.getLastSubmission();
                assert.deepEqual({selector: 'one', noClear: 'testing'}, submission.data);
                done();
              });
          });

          it('Should clearOnHide when set to true', async () => {
            var components = [
              {
                "input": true,
                "tableView": true,
                "inputType": "radio",
                "label": "Selector",
                "key": "selector",
                "values": [
                  {
                    "value": "one",
                    "label": "One"
                  },
                  {
                    "value": "two",
                    "label": "Two"
                  }
                ],
                "defaultValue": "",
                "protected": false,
                "persistent": true,
                "validate": {
                  "required": false,
                  "custom": "",
                  "customPrivate": false
                },
                "type": "radio",
                "conditional": {
                  "show": "",
                  "when": null,
                  "eq": ""
                }
              },
              {
                "input": false,
                "title": "Panel",
                "theme": "default",
                "components": [
                  {
                    "input": true,
                    "tableView": true,
                    "inputType": "text",
                    "inputMask": "",
                    "label": "Clear Me",
                    "key": "clearMe",
                    "placeholder": "",
                    "prefix": "",
                    "suffix": "",
                    "multiple": false,
                    "defaultValue": "",
                    "protected": false,
                    "unique": false,
                    "persistent": true,
                    "clearOnHide": true,
                    "validate": {
                      "required": false,
                      "minLength": "",
                      "maxLength": "",
                      "pattern": "",
                      "custom": "",
                      "customPrivate": false
                    },
                    "conditional": {
                      "show": null,
                      "when": null,
                      "eq": ""
                    },
                    "type": "textfield"
                  }
                ],
                "type": "panel",
                "key": "panel",
                "conditional": {
                  "show": "true",
                  "when": "selector",
                  "eq": "two"
                }
              }
            ];

            helper
              .form('test', components)
              .submission({
                selector: 'one',
                clearMe: 'Clear Me!!!!'
              })
              .execute(function(err) {
                if (err) {
                  return done(err);
                }

                var submission = helper.getLastSubmission();
                assert.deepEqual({selector: 'one'}, submission.data);
                done();
              });
          });
    */
});
