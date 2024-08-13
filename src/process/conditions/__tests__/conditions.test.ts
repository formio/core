import { expect } from 'chai';
import { processSync } from '../../process'
import { conditionProcessInfo } from '../index';
import { ConditionsScope, ProcessContext } from 'types';
import { get } from 'lodash';

const processForm = (form: any, submission: any) => {
    const context: ProcessContext<ConditionsScope> = {
        processors: [conditionProcessInfo],
        components: form.components,
        data: submission.data,
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
                    input: true
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
                            operator: 'isEmpty'
                          }
                        ]
                      },
                }
            ]
        };

        const submission = {
            data: {
                a: '',
            }
        };

        const context: ProcessContext<ConditionsScope> = processForm(form, submission);
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
  
      expect(get(context, 'scope.conditionals[0].conditionallyHidden')).to.be.false;
    });
});
