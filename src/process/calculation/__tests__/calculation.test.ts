import { expect } from 'chai';
import { process } from '../../process'
import { calculateProcess } from '../index';
import { CalculationScope, ProcessContext, ProcessorScope } from 'types';

const processForm = async (form: any, submission: any) => {
    const context: ProcessContext<CalculationScope> = {
        processors: [calculateProcess],
        components: form.components,
        data: submission.data,
        scope: {}
    };
    await process(context);
    return context;
};

describe('Calculation processor', () => {
    it('Calculation processor will perform a simple calculation', async () => {
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
                },
                {
                    type: 'number',
                    key: 'c',
                    input: true,
                    calculateValue: 'value = data.a + data.b'
                }
            ]
        };
    
        const submission = {
            data: {
                a: 1,
                b: 2
            }
        };
    
        const context: ProcessContext<CalculationScope> = await processForm(form, submission);
        expect(context.data.c).to.equal(3);
    });
});