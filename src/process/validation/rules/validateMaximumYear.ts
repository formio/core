import _ from 'lodash';

import { ValidatorError, FieldError } from 'error';
import { DayComponent } from 'types/Component';
import { RuleFn } from 'types';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component.type === 'day' &&
        (component.hasOwnProperty('maxYear') || component.fields?.year?.hasOwnProperty('maxYear'))
    );
};

export const validateMaximumYear: RuleFn = async (context) => {
    const { component, value } = context;
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new ValidatorError(`Cannot validate maximum year for value ${value}`);
    }
    const testValue = typeof value === 'string' ? value : String(value);
    const testArr = /\d{4}$/.exec(testValue);
    const year = testArr ? testArr[0] : null;
    if (
        component.maxYear &&
        component.fields?.year?.maxYear &&
        component.maxYear !== component.fields.year.maxYear
    ) {
        throw new ValidatorError(
            'Cannot validate maximum year, component.maxYear and component.fields.year.maxYear are not equal',
        );
    }
    const maxYear = component.maxYear || component.fields.year.maxYear;

    if (!maxYear || !year) {
        return null;
    }

    return +year <= +maxYear
        ? null
        : new FieldError('maxYear', {...context, maxYear: String(maxYear) });
};
