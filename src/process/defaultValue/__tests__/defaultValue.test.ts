import { expect } from 'chai';
import { process } from '../../process'
import { defaultValueProcess } from '../index';
import { DefaultValueScope, ProcessContext } from 'types';

const processForm = async (form: any, submission: any) => {
    const context: ProcessContext<DefaultValueScope> = {
        processors: [defaultValueProcess],
        components: form.components,
        data: submission.data,
        scope: {}
    };
    await process(context);
    return context;
};

describe('Default Value processor', () => {
    it('Perform default value processors.', async () => {
    });
});