import { expect } from 'chai';
import { processSync } from '../../process';
import { populateProcessInfo } from '../index';
import { PopulateScope, ProcessContext } from 'types';

const processForm = async (form: any, submission: any) => {
  const context: ProcessContext<PopulateScope> = {
    processors: [populateProcessInfo],
    components: form.components,
    data: submission.data,
    scope: { data: submission.data },
  };
  await processSync(context);
  return context;
};

describe('Populate processor', function () {
  it('Should Populate a Data Grid with some Text fields', async function () {
    const form = {
      components: [
        {
          type: 'datagrid',
          key: 'grid',
          components: [
            {
              type: 'textfield',
              key: 'a',
            },
            {
              type: 'textfield',
              key: 'b',
            },
            {
              type: 'textfield',
              key: 'c',
            },
          ],
        },
      ],
    };

    const submission = { data: {} };
    const context: ProcessContext<PopulateScope> = await processForm(form, submission);
    expect(context.data).to.deep.equal({
      grid: [{}],
    });
    context.scope.row.a = 'foo';
    context.scope.row.b = 'bar';
    context.scope.row.c = 'baz';
    expect(context.data).to.deep.equal({
      grid: [
        {
          a: 'foo',
          b: 'bar',
          c: 'baz',
        },
      ],
    });
  });
});
