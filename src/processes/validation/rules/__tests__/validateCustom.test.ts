import { expect } from 'chai';

import { FieldError } from 'error';
import { TextFieldComponent } from 'types';
import { simpleTextField } from './fixtures/components';
import { validateCustom } from '../validateCustom';

it('A simple custom validation will correctly be interpolated', async () => {
    const component: TextFieldComponent = {
        ...simpleTextField,
        validate: {
            custom: 'valid = "Invalid entry"',
        },
    };
    const result = await validateCustom(
        component,
        {
            simpleComponent: 'any thing',
        });
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
    const result = await validateCustom(
        component,
        {
            simpleComponent: 'any thing',
        },
    );
    expect(result).to.equal(null);
});
