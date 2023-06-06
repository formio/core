import { Validator } from '../Validator';
import { FieldError } from '../../error/FieldError';
import { rules as allRules } from '../rules';
import { normalEvalValidatorConfig } from 'test/fixtures/validatorConfig';
import { simpleForm } from 'test/fixtures/forms';

test('Validator will throw the correct errors given a flat components array', async () => {
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
        const validator = new Validator(component, allRules, normalEvalValidatorConfig);
        const errorArr: FieldError[] = await validator.process(data);
        if (errorArr) {
            errors = [...errors, ...errorArr.map((error) => error.message)];
        }
    }
    expect(errors).toHaveLength(6);
});
