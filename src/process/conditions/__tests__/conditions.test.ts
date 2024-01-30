import { expect } from 'chai';
import { process } from '../../process'
import { conditionProcessInfo } from '../index';
import { ConditionsScope, ProcessContext } from 'types';

const processForm = async (form: any, submission: any) => {
    const context: ProcessContext<ConditionsScope> = {
        processors: [conditionProcessInfo],
        components: form.components,
        data: submission.data,
        scope: {}
    };
    await process(context);
    return context;
};

describe('Condition processor', () => {
    it('Perform conditional data with "clearOnHide" enabled.', async () => {
        const form = {
            components: [
                {
                    type: 'number',
                    key: 'a',
                    input: true
                },
                {
                    type: 'number',
                    key: 'b',
                    input: true
                }
            ]
        };
    
        const submission = {
            data: {
                a: 1,
                b: 2
            }
        };
    
        const context: ProcessContext<ConditionsScope> = await processForm(form, submission);
        console.log(context);
    });
});