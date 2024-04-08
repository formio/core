import { expect } from 'chai';
import { validateProcess } from '../index';
import { rules } from "../rules";
import { simpleForm } from './fixtures/forms';
import { ProcessorType, ValidationScope } from 'types';
import get from 'lodash/get';

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
        const scope: ValidationScope = { errors: [] };
        await validateProcess({
            component,
            scope,
            data,
            row: data,
            path,
            value: get(data, component.key),
            processor: ProcessorType.Validate,
            rules
        });
        if (scope.errors) {
            errors = [...errors, ...scope.errors.map((error) => error.errorKeyOrMessage)];
        }
    }
    expect(errors).to.have.length(6);
});

it('Validation errors (FieldErrors) should include the rule name mapping in the "validator" param', async () => {
    let errors: string[] = [];
    const data = {
        requiredField: ''
    };
    for (let component of simpleForm.components) {
        const path = component.key;
        const scope: ValidationScope = { errors: [] };
        await validateProcess({
            component,
            scope,
            data,
            row: data,
            path,
            value: get(data, component.key),
            processor: ProcessorType.Validate,
            rules
        });
        if (scope.errors) {
            errors = [...errors, ...scope.errors.map((error) => error.errorKeyOrMessage)];
        }
    }
    console.log(errors);
});
