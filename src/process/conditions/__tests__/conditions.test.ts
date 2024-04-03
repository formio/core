import { expect } from 'chai';
import { processSync } from '../../process'
import { conditionProcessInfo } from '../index';
import { ConditionsScope, ProcessContext } from 'types';

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
});
