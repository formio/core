import { expect } from 'chai';

import { FieldError } from 'error';
import { TextFieldComponent } from 'types';
import { simpleTextField } from './fixtures/components';
import { validateCustom } from '../validateCustom';
import { generateProcessContext } from './fixtures/util';

it('A simple custom validation will correctly be interpolated', async () => {
    const component: TextFieldComponent = {
        ...simpleTextField,
        validate: {
            custom: 'valid = "Invalid entry"',
        },
    };
    const data = {
        simpleComponent: 'any thing',
    }
    const context = generateProcessContext(component, data);
    const result = await validateCustom(context);
    expect(result).to.be.instanceOf(FieldError);
    expect(result && result.errorKeyOrMessage).to.equal('Invalid entry');
});

it('A custom validation that includes data will correctly be interpolated', async () => {
    const component: TextFieldComponent = {
        ...simpleTextField,
        validate: {
            custom: 'valid = data.simpleComponent === "any thing" ? true : "Invalid entry"',
        },
    };
    const data = {
        simpleComponent: 'any thing',
    }
    const context = generateProcessContext(component, data);
    const result = await validateCustom(context);
    expect(result).to.equal(null);
});
