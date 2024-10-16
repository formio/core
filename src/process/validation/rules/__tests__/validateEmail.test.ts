import { expect } from 'chai';

import { FieldError } from 'error';
import { simpleEmailField } from './fixtures/components';
import { generateProcessorContext } from './fixtures/util';
import { validateEmail } from '../validateEmail';

describe('validateEmail', function () {
  it('Validating a valid email will return null', async function () {
    const component = simpleEmailField;
    const data = {
      component: 'sales@form.io',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateEmail(context);
    expect(result).to.equal(null);
  });

  it('Validating an invalid email will return a FieldError', async function () {
    const component = simpleEmailField;
    const data = {
      component: 'salesatform.io',
    };
    const context = generateProcessorContext(component, data);
    const result = await validateEmail(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result?.errorKeyOrMessage).to.contain('invalid_email');
  });
});
