import { expect } from 'chai';
import assert from 'node:assert';
import type { ContainerComponent, ValidationScope } from 'types';
import { getComponent } from 'utils/formUtil';
import { process, processSync, Processors } from '../index';
import { fastCloneDeep } from 'utils';
import {
  addressComponentWithOtherCondComponents,
  addressComponentWithOtherCondComponents2,
  clearOnHideWithCustomCondition,
  clearOnHideWithHiddenParent,
  forDataGridRequired,
  skipValidForConditionallyHiddenComp,
  skipValidForLogicallyHiddenComp,
  skipValidWithHiddenParentComp,
  requiredFieldInsideEditGrid,
} from './fixtures';
import _ from 'lodash';

describe('Process Tests', function () {
  it('Should submit data within a nested form.', async function () {
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
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Address 2',
                          tableView: false,
                          key: 'address2',
                          type: 'textfield',
                          input: true,
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'City',
                          tableView: false,
                          key: 'city',
                          type: 'textfield',
                          input: true,
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'State',
                          tableView: false,
                          key: 'state',
                          type: 'textfield',
                          input: true,
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Country',
                          tableView: false,
                          key: 'country',
                          type: 'textfield',
                          input: true,
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
                        },
                        {
                          label: 'Zip Code',
                          tableView: false,
                          key: 'zip',
                          type: 'textfield',
                          input: true,
                          customConditional: "show = _.get(instance, 'parent.manualMode', false);",
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
            editGrid: [],
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
      _,
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should allow data from a Conditionally shown nested form when another nested form is conditionally not shown.', async function () {
    const form = {
      components: [
        {
          label: 'Radio',
          values: [
            {
              label: 'Show A',
              value: 'a',
              shortcut: '',
            },
            {
              label: 'Show B',
              value: 'b',
              shortcut: '',
            },
          ],
          key: 'radio',
          type: 'radio',
          input: true,
        },
        {
          label: 'Form',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'radio',
                operator: 'isEqual',
                value: 'a',
              },
            ],
          },
          type: 'form',
          key: 'form',
          input: true,
          components: [
            {
              label: 'Form',
              key: 'form',
              type: 'form',
              input: true,
              components: [
                {
                  label: 'Text Field',
                  validate: {
                    required: true,
                  },
                  key: 'textField',
                  type: 'textfield',
                  input: true,
                },
                {
                  label: 'Text Field',
                  key: 'textField1',
                  type: 'textfield',
                  input: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Form',
          key: 'form1',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'radio',
                operator: 'isEqual',
                value: 'b',
              },
            ],
          },
          type: 'form',
          input: true,
          components: [
            {
              label: 'Form',
              key: 'form',
              type: 'form',
              input: true,
              components: [
                {
                  label: 'Text Field',
                  validate: {
                    required: true,
                  },
                  key: 'textField',
                  type: 'textfield',
                  input: true,
                },
                {
                  label: 'Text Field',
                  key: 'textField1',
                  type: 'textfield',
                  input: true,
                },
              ],
            },
          ],
        },
      ],
    };
    const submission = {
      data: {
        radio: 'b',
        form1: {
          data: {
            form: {
              data: {
                textField: 'one 1',
                textField1: 'two 2',
              },
            },
          },
        },
      },
    };
    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(_.get(context.submission.data, 'form1.data.form.data.textField'), 'one 1');
    assert.equal(_.get(context.submission.data, 'form1.data.form.data.textField1'), 'two 2');
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
      processors: Processors,
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

  it('Should produce errors for a multivalue textfield with a required value', async function () {
    const submission = { data: {} };
    const form = {
      components: [
        {
          input: true,
          tableView: true,
          inputType: 'text',
          inputMask: '',
          label: 'Text Field',
          key: 'textField',
          placeholder: '',
          prefix: '',
          suffix: '',
          multiple: true,
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
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal((context.scope as any).errors.length, 2);
    assert.equal((context.scope as any).errors[0].ruleName, 'array');
    assert.equal((context.scope as any).errors[1].ruleName, 'required');
  });

  it('Sets a value based on advanced conditions', async function () {
    const form = {
      components: [
        {
          properties: {},
          tags: [],
          labelPosition: 'top',
          hideLabel: false,
          type: 'textfield',
          conditional: {
            eq: '',
            when: null,
            show: '',
          },
          validate: {
            customPrivate: false,
            custom: '',
            pattern: '',
            maxLength: '',
            minLength: '',
            required: false,
          },
          clearOnHide: true,
          hidden: false,
          persistent: true,
          unique: false,
          protected: false,
          defaultValue: '',
          multiple: false,
          suffix: '',
          prefix: '',
          placeholder: '',
          key: 'test',
          label: 'Test',
          inputMask: '',
          inputType: 'text',
          tableView: true,
          input: true,
        },
        {
          properties: {},
          tags: [],
          labelPosition: 'top',
          hideLabel: false,
          type: 'textfield',
          conditional: {
            eq: '',
            when: null,
            show: '',
          },
          validate: {
            customPrivate: false,
            custom: '',
            pattern: '',
            maxLength: '',
            minLength: '',
            required: false,
          },
          clearOnHide: true,
          hidden: false,
          persistent: true,
          unique: false,
          protected: false,
          defaultValue: '',
          multiple: false,
          suffix: '',
          prefix: '',
          placeholder: '',
          key: 'changeme',
          label: 'Change me',
          inputMask: '',
          inputType: 'text',
          tableView: true,
          input: true,
          logic: [
            {
              name: 'Test 1',
              trigger: {
                javascript: "result = data.test === '1';",
                type: 'javascript',
              },
              actions: [
                {
                  name: 'Set Value',
                  type: 'value',
                  value: "value = 'Foo'",
                },
              ],
            },
          ],
        },
      ],
    };
    const submission = {
      data: { test: '1' },
    };
    const context: any = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.data.test, '1');
    assert.equal(context.data.changeme, 'Foo');
  });

  it('Should process nested form data correctly', async function () {
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
      form: '65e74c65ef4451c9ede341e3',
    };
    const form = {
      title: 'Parent Form',
      name: 'parentForm',
      path: 'parentform',
      type: 'form',
      display: 'form',
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
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data.child.data.output).to.equal(20);
  });

  it('Should process nested data correctly.', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
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

  it('Should allow the submission to go through if the subform is conditionally hidden', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(context.scope.errors.length, 0);
    assert.equal(context.data.showA, false);
    assert.equal(context.data.showB, true);
    assert.equal(context.data.showC, true);
    assert(!context.data.hasOwnProperty('childA'), 'The childA form should not be present.');
    assert.deepEqual(context.data.childB.data, {
      c: 'Three',
      d: 'Four',
    });
    assert.deepEqual(context.data.childC.data, {
      e: 'Five',
      f: 'Six',
    });
  });

  it('Should not unset submission data of nested forms with identical keys', function () {
    const parentForm = {
      display: 'form',
      tags: [],
      deleted: null,
      components: [
        {
          type: 'checkbox',
          label: 'Show A',
          key: 'showA',
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
              type: 'form',
              form: 'sharedChildFormId',
              label: 'Grandchild',
              key: 'grandchild',
              input: true,
              components: [
                {
                  type: 'textfield',
                  label: 'A',
                  key: 'a',
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
            when: 'showA',
            eq: false,
          },
          components: [
            {
              type: 'form',
              form: 'sharedChildFormId',
              label: 'Grandchild',
              key: 'grandchild',
              input: true,
              components: [
                {
                  type: 'textfield',
                  label: 'A',
                  key: 'a',
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
          ],
        },
      ],
    };
    const submission = {
      data: {
        showA: false,
        childA: {
          data: {
            grandchild: {
              data: {
                a: 'foo',
                b: 'bar',
              },
            },
          },
        },
        childB: {
          data: {
            grandchild: {
              data: {
                a: 'baz',
                b: 'biz',
              },
            },
          },
        },
      },
    };

    const context = {
      form: parentForm,
      submission,
      data: submission.data,
      components: parentForm.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(context.data.showA, false);
    assert(!context.data.hasOwnProperty('childA'), 'The childA form should not be present.');
    assert.deepEqual(context.data.childB.data, {
      grandchild: {
        data: {
          a: 'baz',
          b: 'biz',
        },
      },
    });
  });

  it('Should process data within a fieldset properly.', async function () {
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
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data.firstName).to.equal('Joe');
    expect(context.data.lastName).to.equal('Smith');
  });

  it('Requires a conditionally visible field', async function () {
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
      processors: Processors,
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

  it("Doesn't require a conditionally hidden field", async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Allows a conditionally required field', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Ignores conditionally hidden fields', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.deepEqual(context.data, { selector: 'one' });
    assert.equal(context.scope.errors.length, 0);
  });

  it('Requires a conditionally visible field in a panel', async function () {
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
      processors: Processors,
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

  it("Doesn't require a conditionally hidden field in a panel", async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Allows a conditionally required field in a panel', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should ignore conditionally hidden fields in a panel during validation', async function () {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    assert.deepEqual(context.data, { selector: 'one' });
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should not include submission data for conditionally hidden fields', async function () {
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
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({ textField: '' });
  });

  it('Should not include submission data for logically hidden fields', async function () {
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
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({ textField: '' });
  });

  it('Should allow conditionally hidden text fields within DataGrid and EditGrids', async function () {
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
                    label: 'Hide',
                    value: 'hide',
                  },
                  {
                    label: 'Show',
                    value: 'show',
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
                    value: 'show',
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
            select: 'hide',
          },
          {
            select: 'show',
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
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      editGrid: [
        {
          select: 'hide',
        },
        {
          select: 'show',
          textField: 'TEST',
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data', async function () {
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
      processors: Processors,
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

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data with nested structures', async function () {
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
      processors: Processors,
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

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data, with co-located component keys in the row that are not targets of conditions', async function () {
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
            select: 'action1',
          },
        ],
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
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
          select: 'action1',
        },
      ],
    });
  });

  it('Should allow conditionally hidden components that depend on state outside of the contextual row data, with nested and co-located component keys in the row that are not targets of conditions', async function () {
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
              ],
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
              select: 'action1',
            },
          ],
        },
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
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
            select: 'action1',
          },
        ],
      },
    });
  });

  it('Should correctly provide conditionals path for wizard panels, which affects the accuracy of validation when nested forms are presented ', async function () {
    const form = {
      components: [
        {
          type: 'radio',
          label: 'Choose Form',
          key: 'chooseForm',
          values: [
            { label: 'Show Form A', value: 'a' },
            { label: 'Show Form B', value: 'b' },
          ],
          input: true,
        },
        {
          type: 'form',
          key: 'formA',
          conditional: {
            show: true,
            when: 'chooseForm',
            eq: 'a',
          },
          components: [
            {
              type: 'textfield',
              label: 'Field A',
              key: 'fieldA',
              validate: { required: true },
              input: true,
            },
          ],
          input: true,
        },
        {
          type: 'form',
          key: 'formB',
          conditional: {
            show: true,
            when: 'chooseForm',
            eq: 'b',
          },
          components: [
            {
              type: 'textfield',
              label: 'Field B',
              key: 'fieldB',
              validate: { required: true },
              input: true,
            },
          ],
          input: true,
        },
      ],
    };

    const submission = {
      data: {
        chooseForm: 'b',
        formB: { data: { fieldB: 'Test Value' } },
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors: [] },
      config: { server: true },
    };

    processSync(context);
    assert.equal(context.scope.errors.length, 0);
    expect((context.scope as any).conditionals).to.deep.equal([
      { path: 'formA', conditionallyHidden: true },
      { path: 'formB', conditionallyHidden: false },
    ]);
  });

  it('Should include submission data for logically visible fields', async function () {
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
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect((context.scope as any).conditionals).to.deep.equal([
      {
        path: 'textArea',
        conditionallyHidden: false,
      },
    ]);
    expect(context.data).to.deep.equal({
      textArea: 'should be conditionally visible',
      textField: 'not empty',
    });
  });

  it('Should include submission data for intentionally hidden fields', async function () {
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
        },
      ],
    };

    const submission = {
      data: {
        textField: 'not empty',
        textArea: 'also not empty',
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      textField: 'not empty',
      textArea: 'also not empty',
    });
  });

  it('Should not filter a simple datamap compoennt', async function () {
    const form = {
      display: 'form',
      components: [
        {
          label: 'Data Map',
          tableView: false,
          validateWhenHidden: false,
          key: 'dataMap',
          type: 'datamap',
          path: 'dataMap',
          input: true,
          valueComponent: {
            type: 'textfield',
            key: 'value',
            label: 'Value',
            input: true,
            hideLabel: true,
            tableView: true,
          },
        },
      ],
    };
    const submission = {
      data: {
        dataMap: {
          key1: 'value1',
          key2: 'value2',
        },
      },
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    expect(context.data).to.deep.equal({
      dataMap: {
        key1: 'value1',
        key2: 'value2',
      },
    });
  });

  it('Should allow the submission to go through without errors if there is no subform reference value', async function () {
    const form = {
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
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(context.scope.errors.length, 0);
    assert.deepEqual(context.data.form, { _id: '66c455fc0f00757fd4b0e79b', data: {} });
  });

  it('Should not hide other components data from submission when address component is filled out', async function () {
    const { form, submission } = addressComponentWithOtherCondComponents;
    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    expect(context.submission.data.number).to.be.equal(1);
    expect(context.submission.data.textField).to.be.equal('some text');
  });

  it('Should not hide other components data from submission when address component is not filled out and manual mode enabled', async function () {
    const { form, submission } = addressComponentWithOtherCondComponents2;
    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    expect(context.submission.data.number1).to.be.equal(1);
    expect(context.submission.data.number2).to.be.equal(2);
  });

  it('Should not return validation error for multiple textarea with json data type when first value is array', async function () {
    const form = {
      _id: '66f676f14b77db82b230a201',
      title: 'teterter',
      name: 'teterter',
      path: 'teterter',
      type: 'form',
      display: 'form',
      owner: '64b642526f32c9c544728ea8',
      components: [
        {
          label: 'Text Area',
          applyMaskOn: 'change',
          editor: 'ace',
          autoExpand: false,
          tableView: true,
          multiple: true,
          validateWhenHidden: false,
          key: 'textArea',
          type: 'textarea',
          as: 'json',
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
      project: '66f27e5fcb2889b75ac52c6e',
      created: '2024-09-27T09:12:17.478Z',
      modified: '2024-09-27T09:15:07.820Z',
      machineName: 'qcuzcnfwbclumuw:teterter',
    };

    const submission = {
      form: '66f678ee5879bf08113d361c',
      owner: '637b2e6b48c1227e60b1f910',
      data: {
        textAreaJson: [
          [1, 2, 3],
          [4, 5, 6],
        ],
        submit: true,
      },
      _id: '66f68c17481ea2ffbf5bb310',
      project: '66f66c655879bf08113cf4ed',
      state: 'submitted',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should not unset values for conditionally visible fields with different formats of condtion based on selectboxes value', async function () {
    const form = {
      _id: '66ffa92ac25689df8702f283',
      title: 'cond NEW',
      name: 'condnew',
      path: 'condnew',
      type: 'form',
      display: 'form',
      owner: '637b2e6b48c1227e60b1f910',
      components: [
        {
          label: 'Container',
          tableView: false,
          validateWhenHidden: false,
          key: 'container',
          type: 'container',
          input: true,
          components: [
            {
              label: 'Select Boxes',
              optionsLabelPosition: 'right',
              tableView: false,
              values: [
                {
                  label: 'a',
                  value: 'a',
                  shortcut: '',
                },
                {
                  label: 'b',
                  value: 'b',
                  shortcut: '',
                },
                {
                  label: 'c',
                  value: 'c',
                  shortcut: '',
                },
              ],
              validateWhenHidden: false,
              key: 'selectBoxes',
              type: 'selectboxes',
              input: true,
              inputType: 'checkbox',
            },
          ],
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
                component: 'container.selectBoxes',
                operator: 'isEqual',
                value: 'a',
              },
            ],
          },
          type: 'textfield',
          input: true,
        },
        {
          label: 'Text Field new wrong format',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textFieldNewWrong',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'container.selectBoxes.a',
                operator: 'isEqual',
                value: 'true',
              },
            ],
          },
          type: 'textfield',
          input: true,
        },
        {
          label: 'Text Field Old Format',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textFieldOldFormat',
          conditional: {
            show: true,
            eq: 'true',
            when: 'container.selectBoxes.a',
          },
          type: 'textfield',
          input: true,
        },
        {
          label: 'Submit',
          showValidations: false,
          tableView: false,
          key: 'submit',
          type: 'button',
          input: true,
          saveOnEnter: false,
        },
      ],
    };
    const data = {
      textField: 'correct condition',
      textFieldNewWrong: 'new condition with wrong format',
      textFieldOldFormat: 'legacy condtion',
      container: { selectBoxes: { a: true, b: false, c: false } },
      submit: true,
    };

    const submission = {
      data: fastCloneDeep(data),
      _id: '66f68c17481ea2ffbf5bb310',
      state: 'submitted',
    };

    const errors: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors },
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    (context.scope as any).conditionals.forEach((v: any) =>
      assert.equal(v.conditionallyHidden, false),
    );
    assert.deepEqual(context.data, data);
  });

  it('Should not return error for the form with conditionals based on the Day component', function () {
    const form = {
      _id: '66ffe59b598a729e707869bf',
      title: '9143 condition day',
      name: '9143ConditionDay',
      path: '9143conditionday',
      type: 'form',
      display: 'form',
      components: [
        {
          label: 'Day',
          hideInputLabels: false,
          inputsLabelPosition: 'top',
          useLocaleSettings: false,
          tableView: false,
          fields: {
            day: {
              hide: false,
            },
            month: {
              hide: false,
            },
            year: {
              hide: false,
            },
          },
          validateWhenHidden: false,
          key: 'day',
          type: 'day',
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
                component: 'day',
                operator: 'isDateEqual',
                value: '09/26/2024',
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
      project: '63cead09be0090345b109e22',
      created: '2024-10-04T12:54:51.161Z',
      modified: '2024-10-07T07:47:25.189Z',
      machineName: 'idwqwhclwioyqbw:9143ConditionDay',
    };

    const submission = {
      form: '66ffe59b598a729e707869bf',
      owner: '63ceaccebe0090345b109da7',
      data: {
        day: '09/26/2024',
        submit: true,
        textField: 'test',
      },
      _id: '6703a011275ca049014f7fab',
      project: '63cead09be0090345b109e22',
      state: 'submitted',
    };

    const errors: any = [];
    const conditionals: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors, conditionals },
      config: {
        server: true,
      },
    };

    processSync(context);
    submission.data = context.data;
    expect(context.scope.conditionals).to.have.length(1);
    expect(context.scope.conditionals?.[0].conditionallyHidden).to.equal(false);
    assert.equal(context.scope.errors.length, 0);
  });

  it('Should not unset value of the component inside fieldset inside wizard', function () {
    const form = {
      _id: '67063bc6094b45c5f33ade96',
      title: '8802newOne',
      name: '8802NewOne',
      path: '8802newone',
      type: 'form',
      display: 'wizard',
      owner: '6707a2f60c037c924c716b54',
      components: [
        {
          title: 'Basic & Advanced',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true,
          },
          navigateOnEnter: false,
          saveOnEnter: false,
          scrollToTop: false,
          collapsible: false,
          key: 'page1',
          type: 'panel',
          label: 'Page 1',
          input: false,
          tableView: false,
          components: [
            {
              label: 'Text Field',
              description: 'Hide Text Area when Text Field is Empty',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              type: 'textfield',
              input: true,
            },
            {
              label: 'Text Area',
              applyMaskOn: 'change',
              autoExpand: false,
              tableView: true,
              validateWhenHidden: false,
              key: 'textArea',
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
              type: 'textarea',
              input: true,
            },
          ],
        },
        {
          title: 'Advanced & Layout',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true,
          },
          navigateOnEnter: false,
          saveOnEnter: false,
          scrollToTop: false,
          collapsible: false,
          key: 'page2',
          type: 'panel',
          label: 'Page 2',
          input: false,
          tableView: false,
          components: [
            {
              key: 'fieldSet',
              type: 'fieldset',
              label: 'Field Set',
              input: false,
              tableView: false,
              components: [
                {
                  label: 'Url',
                  applyMaskOn: 'change',
                  tableView: true,
                  validateWhenHidden: false,
                  key: 'url',
                  conditional: {
                    show: true,
                    conjunction: 'all',
                    conditions: [
                      {
                        component: 'textAreaFieldSet',
                        operator: 'isEmpty',
                      },
                    ],
                  },
                  type: 'url',
                  input: true,
                },
                {
                  label: 'Text Area - Field set',
                  description: 'Show URL when Text Area - Field set is empty',
                  applyMaskOn: 'change',
                  autoExpand: false,
                  tableView: true,
                  validateWhenHidden: false,
                  key: 'textAreaFieldSet',
                  type: 'textarea',
                  input: true,
                },
              ],
            },
          ],
        },
      ],
    };

    const submission = {
      data: { textField: '', textAreaFieldSet: 'test' },
      state: 'submitted',
    };

    const errors: any = [];
    const conditionals: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors, conditionals },
      config: {
        server: true,
      },
    };

    processSync(context);
    submission.data = context.data;
    assert.deepEqual(context.data, { textField: '', textAreaFieldSet: 'test' });
    context.scope.conditionals.forEach((cond: any) => {
      expect(cond.conditionallyHidden).to.be.equal(true);
    });
  });

  it('Should not unset value of the conditionally visible component when condtiion is based on select resource with save as ref', function () {
    const form = {
      _id: '670f638c362eca5264b5dc94',
      title: 'test fire',
      name: 'testFire',
      path: 'testfire',
      type: 'form',
      display: 'form',
      owner: '637b2e6b48c1227e60b1f910',
      components: [
        {
          label: 'Select',
          widget: 'choicesjs',
          tableView: true,
          dataSrc: 'resource',
          data: {
            resource: '670f62df362eca5264b5d812',
          },
          template: '<span>{{ item.data.textField }}</span>',
          validateWhenHidden: false,
          key: 'select',
          type: 'select',
          input: true,
          noRefreshOnScroll: false,
          addResource: false,
          reference: true,
        },
        {
          label: 'Text Field Show on test1',
          applyMaskOn: 'change',
          tableView: true,
          validateWhenHidden: false,
          key: 'textFieldShowOnTest1',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'select',
                operator: 'isEqual',
                value: {
                  data: {
                    textField: 'test1',
                  },
                },
              },
            ],
          },
          type: 'textfield',
          input: true,
        },
        {
          label: 'Text Area Not Show on test1',
          applyMaskOn: 'change',
          autoExpand: false,
          tableView: true,
          validateWhenHidden: false,
          key: 'textAreaNotShowOnTest1',
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'select',
                operator: 'isNotEqual',
                value: {
                  data: {
                    textField: 'test1',
                  },
                },
              },
            ],
          },
          type: 'textarea',
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
      project: '66f66c655879bf08113cf465',
    };

    const submission = {
      data: {
        select: {
          _id: '670f62e5362eca5264b5daf9',
          form: '670f62df362eca5264b5d812',
          owner: '637b2e6b48c1227e60b1f910',
          data: { textField: 'test1', submit: true },
          project: '66f66c655879bf08113cf465',
          state: 'submitted',
          created: '2024-10-16T06:53:25.603Z',
          modified: '2024-10-16T06:53:25.604Z',
        },
        submit: true,
        textFieldShowOnTest1: 'test',
      },
    };

    const errors: any = [];
    const conditionals: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors, conditionals },
      config: {
        server: true,
      },
    };

    processSync(context);
    submission.data = context.data;
    assert.deepEqual(context.data.textFieldShowOnTest1, 'test');
    context.scope.conditionals.forEach((cond: any) => {
      assert.equal(cond.conditionallyHidden, cond.path !== 'textFieldShowOnTest1');
    });
  });

  it('Should not unset values of deeply nested form when some components in other forms have conditional components', function () {
    const form = {
      _id: '6718a657d064efa63512550e',
      title: 'eSubmissionsExt',
      name: 'eSubmissionsExt',
      path: 'esubmissionsext',
      type: 'form',
      display: 'wizard',
      tags: [],
      deleted: null,
      owner: '6718e9edf62d8a6fd8104211',
      components: [
        {
          title: 'eSubmissions',
          breadcrumbClickable: true,
          buttonSettings: {
            previous: true,
            cancel: true,
            next: true,
          },
          navigateOnEnter: false,
          saveOnEnter: false,
          scrollToTop: false,
          collapsible: false,
          key: 'eSubmissions',
          type: 'panel',
          label: 'Page 1',
          components: [
            {
              label: 'Text Field',
              applyMaskOn: 'change',
              tableView: true,
              validateWhenHidden: false,
              key: 'textField',
              type: 'textfield',
              input: true,
            },
            {
              label: 'PMTA',
              tableView: true,
              form: '6718a657d064efa6351254eb',
              useOriginalRevision: false,
              reference: false,
              key: 'pmta',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'textField',
                    operator: 'isEqual',
                    value: '5',
                  },
                ],
              },
              type: 'form',
              input: true,
              components: [
                {
                  type: 'button',
                  label: 'Submit',
                  key: 'submit',
                  disableOnInvalid: true,
                  input: true,
                  tableView: false,
                },
                {
                  title: 'Section I - Applicant Identification',
                  breadcrumbClickable: true,
                  buttonSettings: {
                    previous: true,
                    cancel: true,
                    next: true,
                  },
                  navigateOnEnter: false,
                  saveOnEnter: false,
                  scrollToTop: false,
                  collapsible: false,
                  key: 'section1',
                  type: 'panel',
                  label: 'Page 6',
                  input: false,
                  tableView: false,
                  components: [
                    {
                      label: 'Identification Information',
                      tableView: true,
                      form: '6718a657d064efa6351254e4',
                      useOriginalRevision: false,
                      reference: false,
                      clearOnHide: false,
                      key: 'contacts',
                      type: 'form',
                      input: true,
                      components: [
                        {
                          title: 'Part A: Applicant Identification',
                          breadcrumbClickable: true,
                          buttonSettings: {
                            previous: true,
                            cancel: true,
                            next: true,
                          },
                          navigateOnEnter: false,
                          saveOnEnter: false,
                          scrollToTop: false,
                          collapsible: false,
                          key: 'section1A',
                          type: 'panel',
                          label: 'Page 1',
                          components: [
                            {
                              label: 'Applicant Organization',
                              tableView: true,
                              form: '6718a657d064efa6351254c8',
                              useOriginalRevision: false,
                              reference: false,
                              clearOnHide: false,
                              key: 'applicantOrganization',
                              type: 'form',
                              lazyLoad: true,
                              input: true,
                              components: [
                                {
                                  label: 'Address',
                                  tableView: true,
                                  form: '6718f5a4f62d8a6fd8110a41',
                                  useOriginalRevision: false,
                                  reference: false,
                                  clearOnHide: false,
                                  key: 'address',
                                  type: 'form',
                                  input: true,
                                  components: [
                                    {
                                      label: 'Country',
                                      widget: 'choicesjs',
                                      tableView: true,
                                      data: {
                                        values: [
                                          { label: 'a', value: 'a' },
                                          { label: 'b', value: 'b' },
                                        ],
                                        resource: '6718a657d064efa635125495',
                                      },
                                      clearOnHide: false,
                                      validateWhenHidden: false,
                                      key: 'country',
                                      type: 'select',
                                      input: true,
                                    },
                                    {
                                      label: 'Zip Code',
                                      displayMask: '99999-9999',
                                      applyMaskOn: 'change',
                                      tableView: true,
                                      clearOnHide: false,
                                      validateOn: 'blur',
                                      validateWhenHidden: false,
                                      key: 'zipCode',
                                      conditional: {
                                        show: true,
                                        conjunction: 'all',
                                        conditions: [
                                          {
                                            component: 'country',
                                            operator: 'isEqual',
                                            value: 'a',
                                          },
                                        ],
                                      },
                                      type: 'textfield',
                                      input: true,
                                    },
                                    {
                                      label: 'Postal Code',
                                      applyMaskOn: 'change',
                                      tableView: true,
                                      clearOnHide: false,
                                      validateWhenHidden: false,
                                      key: 'postalCode',
                                      conditional: {
                                        show: true,
                                        conjunction: 'all',
                                        conditions: [
                                          {
                                            component: 'country',
                                            operator: 'isNotEqual',
                                            value: 'a',
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
                          ],
                          input: false,
                          tableView: false,
                        },
                        {
                          title: 'Part B: Authorized Representative or U.S. Agent Information',
                          breadcrumbClickable: true,
                          buttonSettings: {
                            previous: true,
                            cancel: true,
                            next: true,
                          },
                          navigateOnEnter: false,
                          saveOnEnter: false,
                          scrollToTop: false,
                          collapsible: false,
                          key: 'section1B',
                          properties: { subsection: '1' },
                          type: 'panel',
                          label: 'Page 1',
                          components: [
                            {
                              label: 'Authorized Representative',
                              tableView: true,
                              form: '6718a657d064efa6351254d6',
                              useOriginalRevision: false,
                              reference: false,
                              clearOnHide: false,
                              key: 'authorizedRepresentative',
                              type: 'form',
                              lazyLoad: true,
                              input: true,
                              components: [
                                {
                                  label: 'Organization',
                                  tableView: true,
                                  form: '6718a657d064efa6351254b0',
                                  useOriginalRevision: false,
                                  reference: false,
                                  key: 'organization',
                                  type: 'form',
                                  input: true,
                                  clearOnHide: false,
                                  components: [
                                    {
                                      label: 'Organization Name',
                                      applyMaskOn: 'change',
                                      tableView: true,
                                      clearOnHide: false,
                                      validateWhenHidden: false,
                                      key: 'organizationName',
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
                            },
                          ],
                          input: false,
                          tableView: false,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          input: false,
          tableView: false,
        },
      ],
      created: '2024-10-23T07:31:35.235Z',
      modified: '2024-10-23T13:14:44.389Z',
    };

    const data = {
      textField: '5',
      pmta: {
        data: {
          contacts: {
            data: {
              applicantOrganization: {
                data: {
                  address: {
                    data: { country: 'a', zipCode: '555555555', postalCode: '' },
                    metadata: { selectData: { country: { label: 'a' } } },
                  },
                },
                metadata: {},
              },
              authorizedRepresentative: {
                data: {
                  organization: {
                    data: { organizationName: '66666' },
                    metadata: {},
                  },
                },
                metadata: {},
              },
            },
          },
        },
      },
    };
    const submission = {
      data: fastCloneDeep(data),
    };

    const errors: any = [];
    const conditionals: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors, conditionals },
      config: {
        server: true,
      },
    };

    processSync(context);
    submission.data = context.data;
    assert.deepEqual(context.data, data);
    context.scope.conditionals.forEach((cond: any) => {
      assert.equal(
        cond.conditionallyHidden,
        cond.path === 'pmta.data.contacts.data.applicantOrganization.data.address.data.postalCode',
      );
    });
  });

  it("Should validate Nested Form's components if it should not be cleared and no data provided", async function () {
    const nestedForm = {
      key: 'form',
      type: 'form',
      display: 'form',
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
    const submission = {
      data: {
        submit: true,
      },
      state: 'submitted',
    };
    const form = {
      title: 'Parent Form',
      name: 'parentForm',
      path: 'parentform',
      type: 'form',
      display: 'form',
      components: [
        nestedForm,
        {
          ...nestedForm,
          key: 'form1',
        },
        {
          type: 'button',
          label: 'Submit',
          key: 'submit',
          input: true,
          tableView: false,
        },
      ],
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    const scope = processSync(context);
    expect((scope as ValidationScope).errors).to.have.length(2);
  });

  it("Should validate Nested Form's components if it should not be cleared and no data provided and the parent form has errors itself", async function () {
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
    const submission = {
      data: {
        submit: true,
      },
      state: 'submitted',
    };
    const form = {
      title: 'Parent Form',
      name: 'parentForm',
      path: 'parentform',
      type: 'form',
      display: 'form',
      components: [
        {
          key: 'textField',
          type: 'textfield',
          validate: {
            required: true,
          },
          input: true,
        },
        nestedForm,
        {
          ...nestedForm,
          key: 'form1',
        },
        {
          type: 'button',
          label: 'Submit',
          key: 'submit',
          input: true,
          tableView: false,
        },
      ],
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    const scope = processSync(context);
    expect((scope as ValidationScope).errors).to.have.length(3);
  });

  it('Should not clear container components when they have child layout components', function () {
    // This form has a parent container with some layout children each containing a text field
    // The issue was that the path was not being correctly evaluated - since the layout component contains the conditional, we were trying to get its
    // path (something like `container.panel`) but instead received `container`, which led to the container being cleared because clearOnHide is
    // enabled by default
    const form = {
      components: [
        {
          label: 'Checkbox',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkbox',
          type: 'checkbox',
          input: true,
        },
        {
          label: 'Container',
          tableView: false,
          validateWhenHidden: false,
          key: 'container',
          type: 'container',
          input: true,
          components: [
            {
              label: 'Panel',
              collapsible: false,
              key: 'panel',
              type: 'panel',
              input: false,
              tableView: false,
              components: [
                {
                  label: 'Text Field',
                  applyMaskOn: 'change',
                  tableView: true,
                  validateWhenHidden: false,
                  key: 'textField',
                  type: 'textfield',
                  input: true,
                },
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel1',
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
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
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel2',
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
                    {
                      label: 'Text Field',
                      applyMaskOn: 'change',
                      tableView: true,
                      validateWhenHidden: false,
                      key: 'textField2',
                      type: 'textfield',
                      input: true,
                    },
                  ],
                },
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel3',
                  conditional: {
                    show: true,
                    conjunction: 'all',
                    conditions: [
                      {
                        component: 'checkbox',
                        operator: 'isEqual',
                        value: false,
                      },
                    ],
                  },
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
                    {
                      label: 'Text Field',
                      applyMaskOn: 'change',
                      tableView: true,
                      validateWhenHidden: false,
                      key: 'textField3',
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
    };

    const submission = {
      data: {
        checkbox: true,
        container: {
          textField: 'hello',
          textField1: 'world',
          textField2: 'foo',
          textField3: 'bar',
        },
        submit: true,
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    // Note that we DID omit textField3, which has clearOnHide enabled by default
    assert.deepEqual(context.data, {
      checkbox: true,
      container: { textField: 'hello', textField1: 'world', textField2: 'foo' },
    });
  });

  it('Should not clear container components when they have child content components', function () {
    // This form has a parent container with some layout children each containing a text field
    // The issue was that the path was not being correctly evaluated - since the layout component contains the conditional, we were trying to get its
    // path (something like `container.panel`) but instead received `container`, which led to the container being cleared because clearOnHide is
    // enabled by default
    const form = {
      components: [
        {
          label: 'Checkbox',
          tableView: false,
          validateWhenHidden: false,
          key: 'checkbox',
          type: 'checkbox',
          input: true,
        },
        {
          label: 'Container',
          tableView: false,
          validateWhenHidden: false,
          key: 'container',
          type: 'container',
          input: true,
          components: [
            {
              label: 'Panel',
              collapsible: false,
              key: 'panel',
              type: 'panel',
              input: false,
              tableView: false,
              components: [
                {
                  label: 'Text Field',
                  applyMaskOn: 'change',
                  tableView: true,
                  validateWhenHidden: false,
                  key: 'textField',
                  type: 'textfield',
                  input: true,
                },
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel1',
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
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
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel2',
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
                    {
                      label: 'Text Field',
                      applyMaskOn: 'change',
                      tableView: true,
                      validateWhenHidden: false,
                      key: 'textField2',
                      type: 'textfield',
                      input: true,
                    },
                  ],
                },
                {
                  label: 'Panel',
                  collapsible: false,
                  key: 'panel3',
                  conditional: {
                    show: true,
                    conjunction: 'all',
                    conditions: [
                      {
                        component: 'checkbox',
                        operator: 'isEqual',
                        value: false,
                      },
                    ],
                  },
                  type: 'panel',
                  input: false,
                  tableView: false,
                  components: [
                    {
                      label: 'Text Field',
                      applyMaskOn: 'change',
                      tableView: true,
                      validateWhenHidden: false,
                      key: 'textField3',
                      type: 'textfield',
                      input: true,
                    },
                  ],
                },
              ],
            },
            {
              html: '<p>content, cond=true</p>',
              label: 'Content',
              refreshOnChange: false,
              key: 'content',
              conditional: {
                show: true,
                conjunction: 'all',
                conditions: [
                  {
                    component: 'checkbox',
                    operator: 'isEqual',
                    value: true,
                  },
                ],
              },
              type: 'content',
              input: false,
              tableView: false,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {
        checkbox: false,
        container: {
          textField: 'hello',
          textField1: 'world',
          textField2: 'foo',
          textField3: 'bar',
        },
        submit: true,
      },
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    processSync(context);
    submission.data = context.data;
    // Note that we DID omit textField3, which has clearOnHide enabled by default
    assert.deepEqual(context.data, {
      checkbox: false,
      container: { textField: 'hello', textField1: 'world', textField2: 'foo', textField3: 'bar' },
    });
  });

  it('Should not return errors for empty multiple values for url and dateTime', function () {
    const form = {
      _id: '671f7fbeaf87b0e2a26e4212',
      title: 'form2',
      name: 'form2',
      path: 'form2',
      type: 'form',
      display: 'form',
      components: [
        {
          label: 'Url',
          applyMaskOn: 'change',
          tableView: true,
          multiple: true,
          validateWhenHidden: false,
          key: 'url',
          type: 'url',
          input: true,
        },
        {
          label: 'Date / Time',
          tableView: false,
          datePicker: {
            disableWeekends: false,
            disableWeekdays: false,
          },
          multiple: true,
          enableMinDateInput: false,
          enableMaxDateInput: false,
          validateWhenHidden: false,
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
          type: 'button',
          label: 'Submit',
          key: 'submit',
          disableOnInvalid: true,
          input: true,
          tableView: false,
        },
      ],
      created: '2024-10-28T12:12:46.715Z',
      modified: '2024-10-29T10:18:00.534Z',
    };

    const submission = {
      data: { url: [], dateTime: [], submit: true },
      state: 'submitted',
    };

    const errors: any = [];
    const conditionals: any = [];
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: { errors, conditionals },
      config: {
        server: true,
      },
    };

    processSync(context);
    submission.data = context.data;
    assert.deepEqual(context.scope.errors.length, 0);
  });

  it('Should calculate value on server for calculations based on dataSource component', async function () {
    const form = {
      _id: '6752ad48eda1569ebc9aaead',
      title: 'cart',
      name: 'Cart',
      path: '9357cart',
      type: 'form',
      display: 'form',
      components: [
        {
          label: 'Products',
          persistent: 'client-only',
          trigger: {
            init: true,
            server: true,
          },
          dataSrc: 'url',
          fetch: {
            url: '{{ config.appUrl }}/product/submission',
            method: 'get',
            headers: [
              {
                key: '',
                value: '',
              },
            ],
            mapFunction: '',
            forwardHeaders: false,
          },
          allowCaching: true,
          key: 'products',
          type: 'datasource',
          input: true,
          tableView: false,
        },
        {
          label: 'Cart',
          reorder: false,
          addAnotherPosition: 'bottom',
          layoutFixed: false,
          enableRowGroups: false,
          initEmpty: false,
          tableView: false,
          key: 'cart',
          type: 'datagrid',
          input: true,
          components: [
            {
              label: 'Product',
              widget: 'choicesjs',
              tableView: true,
              dataSrc: 'custom',
              data: {
                custom: 'values = data.products;',
              },
              valueProperty: '_id',
              template: '\u003Cspan\u003E{{ item.data.name }}\u003C/span\u003E',
              refreshOn: 'products',
              key: 'product',
              type: 'select',
              input: true,
            },
            {
              label: 'Quantity',
              applyMaskOn: 'change',
              mask: false,
              tableView: false,
              delimiter: false,
              requireDecimal: false,
              inputFormat: 'plain',
              truncateMultipleSpaces: false,
              key: 'quantity',
              type: 'number',
              input: true,
              defaultValue: 1,
            },
            {
              label: 'Price',
              applyMaskOn: 'change',
              mask: false,
              tableView: false,
              delimiter: false,
              requireDecimal: false,
              inputFormat: 'plain',
              truncateMultipleSpaces: false,
              redrawOn: 'cart.product',
              calculateValue:
                'var productId = row.product;\nvalue = 0;\nif (productId && data.products && data.products.length) {\n  data.products.forEach(function(product) {\n    if (product._id === productId) {\n      value = product.data.price * (row.quantity || 1);\n    }\n  });\n}',
              calculateServer: true,
              key: 'price',
              type: 'number',
              input: true,
            },
          ],
        },
        {
          label: 'Total',
          applyMaskOn: 'change',
          mask: false,
          tableView: false,
          delimiter: false,
          requireDecimal: false,
          inputFormat: 'plain',
          truncateMultipleSpaces: false,
          redrawOn: 'cart',
          calculateValue:
            'if (data.cart && data.cart.length) {\n  value = data.cart.reduce(function(total, cartItem) {\n    return total + cartItem.price;\n  }, 0);\n}',
          calculateServer: true,
          key: 'total',
          type: 'number',
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
      created: '2024-12-06T07:52:40.891Z',
      modified: '2024-12-06T08:33:40.971Z',
      config: {
        appUrl: 'http://localhost:3000/idwqwhclwioyqbw',
      },
    };

    const resource = [
      {
        _id: '6752adf3eda1569ebc9ab0cd',
        data: {
          name: 'Cream',
          price: 30,
        },
      },
      {
        _id: '6752adf4eda1569ebc9ab0df',
        data: {
          name: 'Perfume',
          price: 100,
        },
      },
      {
        _id: '6752adf4eda1569ebc9ab0f1',
        data: {
          name: 'Soap',
          price: 5,
        },
      },
      {
        _id: '6752adf4eda1569ebc9ab103',
        data: {
          name: 'Toothpaste',
          price: 10,
        },
      },
      {
        _id: '6752adf4eda1569ebc9ab115',
        data: {
          name: 'Shampoo',
          price: 20,
        },
      },
    ];

    const submission = {
      data: {
        cart: [
          {
            product: '6752adf4eda1569ebc9ab115',
            quantity: 5,
            price: 100,
          },
          {
            product: '6752adf4eda1569ebc9ab103',
            quantity: 3,
            price: 30,
          },
          {
            product: '6752adf4eda1569ebc9ab0df',
            quantity: 2,
            price: 200,
          },
        ],
        total: 330,
        submit: true,
      },
      state: 'submitted',
    };

    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      fetch: (): Promise<Response> => {
        return Promise.resolve({
          ok: true,
          json: () => {
            return Promise.resolve(resource);
          },
        } as Response);
      },
      config: {
        server: true,
      },
    };
    await process(context);
    submission.data = context.data;
    assert.deepEqual(context.data, submission.data);
  });

  it('Should return required validation error when the simple conditional value is set as a sting instead of boolean', async function () {
    const form = {
      key: 'form',
      type: 'form',
      input: true,
      components: [
        {
          label: 'Text Field',
          placeholder: 'Text Field',
          tableView: true,
          defaultValue: 'Text Field Default Value',
          validate: {
            required: true,
          },
          unique: true,
          errorLabel: 'TF Custom Error Label',
          key: 'textField',
          properties: {
            pdfLabel: 'Text Field PDF Label',
          },
          conditional: {
            show: true,
            conjunction: 'all',
            conditions: [
              {
                component: 'triggerConditionalLogic',
                operator: 'isEqual',
                value: 'false',
              },
            ],
          },
          logic: [
            {
              name: 'Non-required',
              trigger: {
                type: 'simple',
                simple: {
                  show: true,
                  conjunction: 'all',
                  conditions: [
                    {
                      component: 'triggerLogicMakeNonRequired',
                      operator: 'isEqual',
                      value: 'true',
                    },
                  ],
                },
              },
              actions: [
                {
                  name: 'Non-required',
                  type: 'property',
                  property: {
                    label: 'Required',
                    value: 'validate.required',
                    type: 'boolean',
                  },
                  state: false,
                },
              ],
            },
            {
              name: 'Disabled',
              trigger: {
                type: 'simple',
                simple: {
                  show: true,
                  conjunction: 'all',
                  conditions: [
                    {
                      component: 'triggerLogicMakeDisabled',
                      operator: 'isEqual',
                      value: 'true',
                    },
                  ],
                },
              },
              actions: [
                {
                  name: 'Disabled',
                  type: 'property',
                  property: {
                    label: 'Disabled',
                    value: 'disabled',
                    type: 'boolean',
                  },
                  state: true,
                },
              ],
            },
            {
              name: 'Change Value',
              trigger: {
                type: 'simple',
                simple: {
                  show: true,
                  conjunction: 'all',
                  conditions: [
                    {
                      component: 'checkbox4',
                      operator: 'isEqual',
                      value: 'true',
                    },
                  ],
                },
              },
              actions: [
                {
                  name: 'Change Value',
                  type: 'value',
                  value: 'value = "Modified Value";',
                },
              ],
            },
          ],
          overlay: {
            page: 1,
            left: '100',
            top: '300',
            width: '400',
            height: '30',
          },
          type: 'textfield',
          input: true,
        },
        {
          label: 'Trigger Conditional logic & hide components',
          tableView: false,
          defaultValue: false,
          key: 'triggerConditionalLogic',
          overlay: {
            page: 1,
            left: '100',
            top: '1200',
            width: '30',
            height: '30',
          },
          type: 'checkbox',
          input: true,
        },
        {
          label: 'Trigger Logic & make non-required',
          tableView: false,
          defaultValue: false,
          key: 'triggerLogicMakeNonRequired',
          overlay: {
            page: 1,
            left: 100,
            top: '1250',
            width: '30',
            height: '30',
          },
          type: 'checkbox',
          input: true,
        },
        {
          label: 'Trigger Logic & make disabled',
          tableView: false,
          key: 'triggerLogicMakeDisabled',
          overlay: {
            page: 1,
            left: 100,
            top: '1300',
            width: '30',
            height: '30',
          },
          type: 'checkbox',
          input: true,
          defaultValue: false,
        },
        {
          label: 'Trigger Logic & change values <i>(except File, Signature)</i>',
          tableView: false,
          defaultValue: false,
          key: 'checkbox4',
          overlay: {
            page: 1,
            left: '100',
            top: '1350',
            width: '30',
            height: '30',
          },
          type: 'checkbox',
          input: true,
        },
        {
          label: 'Submit',
          tableView: false,
          key: 'submit',
          type: 'button',
          input: true,
          saveOnEnter: false,
        },
      ],
    };
    const submission = {
      data: {
        checkbox4: false,
        submit: true,
        textField: '',
        triggerConditionalLogic: false,
        triggerLogicMakeDisabled: false,
        triggerLogicMakeNonRequired: false,
      },
      state: 'submitted',
    };
    const context = {
      form,
      submission,
      data: submission.data,
      components: form.components,
      processors: Processors,
      scope: {},
      config: {
        server: true,
      },
    };
    const scope = processSync(context as any);
    expect((scope as ValidationScope).errors).to.have.length(1);
  });

  describe('Required component validation in nested form in DataGrid/EditGrid', function () {
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

    describe('For DataGrid:', function () {
      const components = [
        {
          key: 'dataGrid',
          type: 'datagrid',
          input: true,
          components: [nestedForm],
        },
      ];

      it('Should validate required component when it is filled out', async function () {
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
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        expect(context.data).to.deep.equal({
          dataGrid: [{ form: { data: { textField: 'test' } } }],
        });
        expect((context.scope as ValidationScope).errors).to.have.length(0);
      });

      it('Should not clear a value when it uses simple conditionals to hide and dependent value uses calculated value.', async function () {
        const components: any = [
          {
            label: 'Checkbox',
            tableView: false,
            calculateValue: 'value = true;',
            calculateServer: true,
            validateWhenHidden: false,
            key: 'checkbox',
            type: 'checkbox',
            input: true,
            defaultValue: false,
          },
          {
            label: 'Radio',
            optionsLabelPosition: 'right',
            inline: false,
            tableView: false,
            values: [
              {
                label: 'yes',
                value: 'yes',
                shortcut: '',
              },
              {
                label: 'no',
                value: 'no',
                shortcut: '',
              },
            ],
            validateWhenHidden: false,
            conditional: {
              show: true,
              conjunction: 'all',
              conditions: [
                {
                  component: 'checkbox',
                  operator: 'isEqual',
                  value: true,
                },
              ],
            },
            key: 'radio',
            type: 'radio',
            input: true,
          },
        ];
        const submission = {
          data: {
            radio: 'yes',
          },
        };

        const context = {
          form: { components },
          submission,
          data: submission.data,
          components,
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        assert.equal(context.data.radio, 'yes');
      });

      it('Should not validate required component when it is not filled out', async function () {
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
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        expect((context.scope as ValidationScope).errors).to.have.length(1);
      });
    });

    it('Should skip child validation with conditional', async function () {
      const { form, submission } = skipValidForConditionallyHiddenComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should skip child validation with hidden parent component', async function () {
      const { form, submission } = skipValidWithHiddenParentComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      await process(context);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should skip child validation with logic', async function () {
      const { form, submission } = skipValidForLogicallyHiddenComp;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context as any);
      expect((context.scope as ValidationScope).errors).to.have.length(0);
    });

    it('Should validate when all child components are empty in required Data Grid', async function () {
      const { form, submission } = forDataGridRequired;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      expect((context.scope as ValidationScope).errors).to.have.length(1);
    });

    it('Should validate required an empty array for multiple select', async function () {
      const form = {
        _id: '66f4141e34ac6c4049cc5144',
        title: 'required multiple',
        name: 'requiredMultiple',
        path: 'requiredmultiple',
        type: 'form',
        display: 'form',
        owner: '637b2e6b48c1227e60b1f910',
        components: [
          {
            label: 'Select',
            widget: 'choicesjs',
            tableView: true,
            multiple: true,
            data: {
              values: [
                {
                  label: 'a',
                  value: 'a',
                },
                {
                  label: 'b',
                  value: 'b',
                },
                {
                  label: 'c',
                  value: 'c',
                },
              ],
            },
            validate: {
              required: true,
            },
            validateWhenHidden: false,
            key: 'select',
            type: 'select',
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
        project: '66f26afae0c7ef9920ae59f6',
      };

      const submission = {
        data: { select: [] },
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
        processors: Processors,
        scope: { errors },
        config: {
          server: true,
        },
      };
      processSync(context);
      submission.data = context.data;
      assert.equal(context.scope.errors.length, 1);
      assert.equal(context.scope.errors[0].ruleName, 'required');
    });

    describe('For EditGrid:', function () {
      const components = [
        {
          key: 'editGrid',
          type: 'editgrid',
          input: true,
          components: [nestedForm],
        },
      ];

      it('should return empty array when no data is provided', async function () {
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
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        expect(context.data).to.deep.equal({ editGrid: [] });
      });

      it('Should validate required component when it is filled out', async function () {
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
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        console.log(JSON.stringify(context.data, null, 2));

        expect((context.scope as ValidationScope).errors).to.have.length(0);
        expect(context.data).to.deep.equal({
          editGrid: [{ form: { data: { textField: 'test' } } }],
        });
      });

      it('Should not validate required component when it is not filled out', async function () {
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
          processors: Processors,
          scope: {},
          config: {
            server: true,
          },
        };
        processSync(context);
        expect((context.scope as ValidationScope).errors).to.have.length(1);
      });
    });
  });

  describe('clearOnHide', function () {
    it('Should not include submission data from conditionally hidden containers when clearOnHide ("Omit Data When Conditionally Hidden" is true', async function () {
      const { form, submission } = clearOnHideWithCustomCondition;
      const clonedSubmission = JSON.parse(JSON.stringify(submission));
      const context = {
        form,
        submission: clonedSubmission,
        data: clonedSubmission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      expect(context.data).to.deep.equal({
        candidates: [{ candidate: { data: {} } }],
        submit: true,
      });
    });

    it('Should not return fields from conditionally hidden containers, clearOnHide = false', async function () {
      const { form, submission } = clearOnHideWithCustomCondition;
      const clonedSubmission = JSON.parse(JSON.stringify(submission));
      const containerComponent = getComponent(form.components, 'section6') as ContainerComponent;
      containerComponent.clearOnHide = false;
      const context = {
        form,
        submission: clonedSubmission,
        data: clonedSubmission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      expect(context.data).to.deep.equal({
        candidates: [{ candidate: { data: { section6: {} } } }],
        submit: true,
      });
    });

    it('Should not validate fields from hidden containers, clearOnHide = false', async function () {
      const { form, submission } = clearOnHideWithHiddenParent;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: { errors: [] },
        config: {
          server: true,
        },
      };

      processSync(context);
      expect(context.data).to.deep.equal({
        candidates: [{ candidate: { data: { section6: { c: {}, d: [] } } } }],
        submit: true,
      });
      expect(context.scope.errors.length).to.equal(0);
    });

    it('Should include submission data from hidden containers even when clearOnHide ("Omit Data When Conditionally Hidden" is true', async function () {
      const { form, submission } = clearOnHideWithHiddenParent;
      const containerComponent = getComponent(form.components, 'section6') as ContainerComponent;
      containerComponent.clearOnHide = true;
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
        config: {
          server: true,
        },
      };

      processSync(context);
      expect(context.data).to.deep.equal({
        candidates: [{ candidate: { data: { section6: { c: {}, d: [] } } } }],
        submit: true,
      });
    });

    it('Should include submission data for simple fields that are intentionally hidden, even when clearOnHide ("Omit When Conditionally Hidden") is true', async function () {
      const components = [
        {
          label: 'Text Field',
          tableView: true,
          key: 'textField',
          type: 'textfield',
          input: true,
          hidden: true,
          clearOnHide: true,
        },
      ];
      const submission = {
        data: {
          textField: 'test',
        },
      };
      const context = {
        form: { components },
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ textField: 'test' });
    });

    it('Should include submission data for simple components that are intentionally hidden when clearOnHide ("Omit When Conditionally Hidden") is false', async function () {
      const components = [
        {
          label: 'Text Field',
          tableView: true,
          key: 'textField',
          type: 'textfield',
          input: true,
          hidden: true,
          clearOnHide: false,
        },
      ];
      const submission = {
        data: {
          textField: 'test',
        },
      };
      const context = {
        form: { components },
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ textField: 'test' });
    });

    it('Should include submission data for container components that are intentionally hidden, even when clearOnHide ("Omit When Conditionally Hidden") is true', async function () {
      const components = [
        {
          key: 'container',
          type: 'container',
          input: true,
          hidden: true,
          clearOnHide: true,
          components: [
            {
              label: 'Text Field',
              tableView: true,
              key: 'textField',
              type: 'textfield',
              input: true,
              clearOnHide: true,
            },
          ],
        },
      ];
      const submission = {
        data: {
          container: {
            textField: 'test',
          },
        },
      };
      const context = {
        form: { components },
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ container: { textField: 'test' } });
    });

    it('Should include submission data for container components that are intentionally hidden when clearOnHide ("Omit When Conditionally Hidden") is false', async function () {
      const components = [
        {
          key: 'container',
          type: 'container',
          input: true,
          hidden: true,
          clearOnHide: false,
          components: [
            {
              label: 'Text Field',
              tableView: true,
              key: 'textField',
              type: 'textfield',
              input: true,
              clearOnHide: true,
            },
          ],
        },
      ];
      const submission = {
        data: {
          container: {
            textField: 'test',
          },
        },
      };
      const context = {
        form: { components },
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ container: { textField: 'test' } });
    });

    it("Should not include submission data for simple fields that are conditionally hidden when clearOnHide ('Omit When Conditionally Hidden') is true", async function () {
      const components = [
        {
          type: 'checkbox',
          key: 'selector',
          label: 'Selector',
          input: true,
        },
        {
          label: 'Text Field',
          tableView: true,
          key: 'textField',
          type: 'textfield',
          input: true,
          conditional: {
            show: true,
            when: 'selector',
            eq: true,
          },
          clearOnHide: true,
        },
      ];
      const submission = {
        data: {
          selector: false,
          textField: 'test',
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ selector: false });
    });

    it("Should include submission data for simple fields that are conditionally hidden when clearOnHide ('Omit When Conditionally Hidden') is false", async function () {
      const components = [
        {
          type: 'checkbox',
          key: 'selector',
          label: 'Selector',
          input: true,
        },
        {
          label: 'Text Field',
          tableView: true,
          key: 'textField',
          type: 'textfield',
          input: true,
          conditional: {
            show: true,
            when: 'selector',
            eq: true,
          },
          clearOnHide: false,
        },
      ];
      const submission = {
        data: {
          selector: false,
          textField: 'test',
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ selector: false, textField: 'test' });
    });

    it("Should not include submission data for container components that are conditionally hidden when clearOnHide ('Omit When Conditionally Hidden') is true", async function () {
      const components = [
        {
          type: 'checkbox',
          key: 'selector',
          label: 'Selector',
          input: true,
        },
        {
          key: 'container',
          type: 'container',
          input: true,
          conditional: {
            show: true,
            when: 'selector',
            eq: true,
          },
          clearOnHide: true,
          components: [
            {
              label: 'Text Field',
              tableView: true,
              key: 'textField',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ];
      const submission = {
        data: {
          selector: false,
          container: {
            textField: 'test',
          },
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ selector: false });
    });

    it("Should include submission data for container components that are conditionally hidden when clearOnHide ('Omit When Conditionally Hidden') is false (but not their children, assuming clearOnHide is true or omitted in the child)", async function () {
      const components = [
        {
          type: 'checkbox',
          key: 'selector',
          label: 'Selector',
          input: true,
        },
        {
          key: 'container',
          type: 'container',
          input: true,
          conditional: {
            show: true,
            when: 'selector',
            eq: true,
          },
          clearOnHide: false,
          components: [
            {
              label: 'Text Field',
              tableView: true,
              key: 'textField',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ];
      const submission = {
        data: {
          selector: false,
          container: {
            textField: 'test',
          },
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ selector: false, container: {} });
    });

    it("Should include submission data for container components that are conditionally hidden when clearOnHide ('Omit When Conditionally Hidden') is false (and include their children when clearOnHide is false in the child)", async function () {
      const components = [
        {
          type: 'checkbox',
          key: 'selector',
          label: 'Selector',
          input: true,
        },
        {
          key: 'container',
          type: 'container',
          input: true,
          conditional: {
            show: true,
            when: 'selector',
            eq: true,
          },
          clearOnHide: false,
          components: [
            {
              label: 'Text Field',
              tableView: true,
              key: 'textField',
              type: 'textfield',
              input: true,
              clearOnHide: false,
            },
          ],
        },
      ];
      const submission = {
        data: {
          selector: false,
          container: {
            textField: 'test',
          },
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      expect(context.data).to.deep.equal({ selector: false, container: { textField: 'test' } });
    });

    it("Should save 'level' field when custom error message is defined to correctly add error classes into app template ", async function () {
      const components = [
        {
          label: 'Text Field',
          applyMaskOn: 'change',
          tableView: true,
          validate: {
            required: true,
            customMessage: 'mikhail',
          },
          validateWhenHidden: false,
          key: 'textField',
          type: 'textfield',
          input: true,
        },
        {
          label: 'Submit',
          showValidations: false,
          tableView: false,
          key: 'submit',
          type: 'button',
          input: true,
          saveOnEnter: false,
        },
      ];
      const submission = {
        data: {
          textField: '',
          submit: true,
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {} as { errors: Record<string, unknown>[] },
      };
      processSync(context);
      expect(context.scope.errors[0].level).to.equal('error');
    });

    it('Should not show validation errors for required component inside conditionally hidden editGrid', async function () {
      const components = requiredFieldInsideEditGrid;
      const submission = {
        data: {
          selectGrids: '',
          submit: true,
        },
      };
      const context = {
        submission,
        data: submission.data,
        components,
        processors: Processors,
        scope: {} as { errors: Record<string, unknown>[] },
      };
      processSync(context);
      submission.data = context.data;
      expect(context.scope.errors.length).to.equal(0);
    });

    it('Should not add undefined values for components.', async function () {
      const form = {
        components: [
          {
            input: true,
            tableView: true,
            inputType: 'text',
            inputMask: '',
            label: 'fname',
            key: 'fname',
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
              show: '',
              when: null,
              eq: '',
            },
            type: 'textfield',
          },
          {
            input: true,
            tableView: true,
            inputType: 'text',
            inputMask: '',
            label: 'lname',
            key: 'lname',
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
              show: '',
              when: null,
              eq: '',
            },
            type: 'textfield',
          },
        ],
      };
      const submission = {
        data: {},
      };
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
      };
      processSync(context);
      assert(!context.data.hasOwnProperty('fname'));
      assert(!context.data.hasOwnProperty('lname'));
    });

     it('Should not return the error for required component with logic where result var is used', async function () {
      const form = {
        components: [
          {
            label: 'Registration number required',
            applyMaskOn: 'change',
            tableView: true,
            case: 'uppercase',
            validate: {
              required: true,
              maxLength: 50,
            },
            validateWhenHidden: false,
            key: 'plateNumber2',
            logic: [
              {
                name: 'keep letter and number',
                trigger: {
                  type: 'javascript',
                  javascript: 'result=row[component.key];',
                },
                actions: [
                  {
                    name: 'set',
                    type: 'value',
                    value: "value=result.replace(/[^a-zA-Z0-9]/g, '');\n",
                  },
                ],
              },
            ],
            type: 'textfield',
            input: true,
            keyModified: true,
          },
          {
            label: 'Submit',
            showValidations: false,
            tableView: false,
            key: 'submit',
            type: 'button',
            input: true,
          },
        ],
      };
      const submission = {
        data: { plateNumber2: 'TEST', submit: true },
      };
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
      };
      processSync(context as any);
      assert.equal(context.data.plateNumber2, 'TEST');
      assert.equal((context.scope as any).errors.length, 0);
    });

    it('Should return the value formatted by logic where result var is used', async function () {
      const form = {
        components: [
          {
            label: 'Registration number required',
            applyMaskOn: 'change',
            tableView: true,
            case: 'uppercase',
            validate: {
              required: true,
              maxLength: 50,
            },
            validateWhenHidden: false,
            key: 'plateNumber2',
            logic: [
              {
                name: 'keep letter and number',
                trigger: {
                  type: 'javascript',
                  javascript: 'result=row[component.key];',
                },
                actions: [
                  {
                    name: 'set',
                    type: 'value',
                    value: "value=result.replace(/[^a-zA-Z0-9]/g, '');\n",
                  },
                ],
              },
            ],
            type: 'textfield',
            input: true,
            keyModified: true,
          },
          {
            label: 'Submit',
            showValidations: false,
            tableView: false,
            key: 'submit',
            type: 'button',
            input: true,
          },
        ],
      };
      const submission = {
        data: { plateNumber2: 'TEST 123 TEST', submit: true },
      };
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
      };
      processSync(context as any);
      assert.equal(context.data.plateNumber2, 'TEST123TEST');
      assert.equal((context.scope as any).errors.length, 0);
    });

    it('Should return the error for required component with logic where result var is used', async function () {
      const form = {
        components: [
          {
            label: 'Registration number required',
            applyMaskOn: 'change',
            tableView: true,
            case: 'uppercase',
            validate: {
              required: true,
              maxLength: 50,
            },
            validateWhenHidden: false,
            key: 'plateNumber2',
            logic: [
              {
                name: 'keep letter and number',
                trigger: {
                  type: 'javascript',
                  javascript: 'result=row[component.key];',
                },
                actions: [
                  {
                    name: 'set',
                    type: 'value',
                    value: "value=result.replace(/[^a-zA-Z0-9]/g, '');\n",
                  },
                ],
              },
            ],
            type: 'textfield',
            input: true,
            keyModified: true,
          },
          {
            label: 'Submit',
            showValidations: false,
            tableView: false,
            key: 'submit',
            type: 'button',
            input: true,
          },
        ],
      };
      const submission = {
        data: { plateNumber2: '', submit: true },
      };
      const context = {
        form,
        submission,
        data: submission.data,
        components: form.components,
        processors: Processors,
        scope: {},
      };
      processSync(context as any);
      assert.equal((context.scope as any).errors.length, 1);
    });
  });
});
