import { expect } from 'chai';

import { FieldError } from 'error/FieldError';
import { simpleTextField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateJson } from '../validateJson';

describe('validateJson', function () {
  it('A simple component without JSON logic validation will return null', async function () {
    const component = simpleTextField;
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateJson(context);
    expect(result).to.equal(null);
  });

  it('A simple component with JSON logic evaluation will return a FieldError if the JSON logic returns invalid', async function () {
    const component = {
      ...simpleTextField,
      validate: {
        json: {
          if: [
            {
              '===': [
                {
                  var: 'input',
                },
                'foo',
              ],
            },
            true,
            "Input must be 'foo'",
          ],
        },
      },
    };
    const data = {
      component: 'Hello, world!',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateJson(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain("Input must be 'foo'");
  });

  it('A simple component with JSON logic evaluation will return null if the JSON logic returns valid', async function () {
    const component = {
      ...simpleTextField,
      validate: {
        json: {
          if: [
            {
              '===': [
                {
                  var: 'input',
                },
                'foo',
              ],
            },
            true,
            "Input must be 'foo'",
          ],
        },
      },
    };
    const data = {
      component: 'foo',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateJson(context);
    expect(result).to.equal(null);
  });

  it('A simple component with JSON logic evaluation will validate even if the value is falsy', async function () {
    const component = {
      ...simpleTextField,
      validate: {
        json: {
          if: [
            {
              '===': [
                {
                  var: 'input',
                },
                'foo',
              ],
            },
            true,
            "Input must be 'foo'",
          ],
        },
      },
    };
    const data = {
      component: '',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateJson(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain("Input must be 'foo'");
  });

  it('Should have access to form JSON in its validation context', async function () {
    const component = {
      ...simpleTextField,
      validate: {
        json: {
          if: [
            {
              '>': [
                {
                  var: 'form.components',
                },
                5,
              ],
            },
            true,
            'Form must have greater than 5 components',
          ],
        },
      },
    };
    const form = {
      components: [component],
    };
    const data = {
      component: 'foo',
    };
    const context = generateProcessorContext(component, data, form);
    const result = await validateJson(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('Form must have greater than 5 components');
  });
});
