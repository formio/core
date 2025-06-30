import { expect } from 'chai';
import { process } from '../../process';
import { calculateProcessInfo } from '../index';
import { CalculationScope, ProcessContext } from 'types';

const processForm = async (form: any, submission: any) => {
  const context: ProcessContext<CalculationScope> = {
    processors: [calculateProcessInfo],
    components: form.components,
    data: submission.data,
    scope: {},
  };
  await process(context);
  return context;
};

describe('Calculation processor', function () {
  it('Calculation processor will perform a simple calculation', async function () {
    const form = {
      components: [
        {
          type: 'number',
          key: 'a',
          input: true,
        },
        {
          type: 'number',
          key: 'b',
          input: true,
        },
        {
          type: 'number',
          key: 'c',
          input: true,
          calculateValue: 'value = data.a + data.b',
        },
      ],
    };

    const submission = {
      data: {
        a: 1,
        b: 2,
      },
    };

    const context: ProcessContext<CalculationScope> = await processForm(form, submission);
    expect(context.data.c).to.equal(3);
  });

  it('Calculation processor will perform a simple calculation that overwrites the value prop', async function () {
    const form = {
      components: [
        {
          type: 'number',
          key: 'a',
          input: true,
        },
        {
          type: 'number',
          key: 'b',
          input: true,
        },
        {
          type: 'number',
          key: 'c',
          input: true,
          calculateValue: 'value = value + data.a + data.b',
        },
      ],
    };

    const submission = {
      data: {
        a: 1,
        b: 2,
        c: 3,
      },
    };

    const context: ProcessContext<CalculationScope> = await processForm(form, submission);
    expect(context.data.c).to.equal(6);
  });

  it('Should not add calculated editGrid row vlaue to the blank submission ', async function () {
    const form = {
      components: [
        {
          label: 'Edit Grid',
          key: 'editGrid',
          type: 'editgrid',
          input: true,
          components: [
            {
              label: 'Set me on server',
              calculateValue: 'value = "Value set on server"',
              calculateServer: true,
              key: 'fieldA',
              type: 'textfield',
              input: true,
            },
          ],
        },
      ],
    };

    const submission = {
      data: {},
      server: true,
    };

    const context: ProcessContext<CalculationScope> = await processForm(form, submission);
    expect(context.data).to.deep.equal({});
  });
});
