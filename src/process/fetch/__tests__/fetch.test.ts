import { expect } from 'chai';
import { process } from '../../process'
import { fetchProcessInfo } from '../index';
import { FetchScope, ProcessContext } from 'types';

const processForm = async (form: any, submission: any) => {
    const context: ProcessContext<FetchScope> = {
        processors: [fetchProcessInfo],
        components: form.components,
        data: submission.data,
        scope: {}
    };
    await process(context);
    return context;
};

describe('Fetch processor', () => {
    it('Perform a fetch operation.', async () => {
    });
});