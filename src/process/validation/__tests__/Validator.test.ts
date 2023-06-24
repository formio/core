import { expect } from 'chai';
import { FieldError } from 'error/FieldError';
import { validate } from '../validate';
import { simpleForm } from './fixtures/forms';
import { ProcessorType } from 'types';

it('Validator will throw the correct errors given a flat components array', async () => {
    let errors: string[] = [];
    const data = {
        requiredField: '',
        maximumWords:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        minimumWords: 'Hello',
        email: 'brendanb',
        url: 'htpigoogle',
        inputMask: 'hello, world',
        submit: false,
    };
    for (let component of simpleForm.components) {
        const path = component.key;
        const errorArr: FieldError[] = await validate({ component, data, path, processor: ProcessorType.Validate });
        if (errorArr) {
            errors = [...errors, ...errorArr.map((error) => error.errorKeyOrMessage)];
        }
    }
    expect(errors).to.have.length(6);
});
