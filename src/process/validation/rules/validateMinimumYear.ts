import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { DayComponent, RuleFn } from 'types';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component?.type === 'day' &&
        (component.hasOwnProperty('minYear') || component.year?.hasOwnProperty('minYear'))
    );
};

export const validateMinimumYear: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, path);
    if (typeof value !== 'string' && typeof value !== 'number') {
        throw new ValidatorError(`Cannot validate minimum year for value ${value}`);
    }
    const testValue = typeof value === 'string' ? value : String(value);
    const testArr = /\d{4}$/.exec(testValue);
    const year = testArr ? testArr[0] : null;
    if (
        component.minYear &&
        component.fields?.year?.minYear &&
        component.minYear !== component.fields.year.minYear
    ) {
        throw new ValidatorError(
            'Cannot validate minimum year, component.minYear and component.fields.year.minYear are not equal'
        );
    }
    const minYear = component.minYear;

    if (!minYear || !year) {
        return null;
    }

    return +year >= +minYear
        ? null
        : new FieldError('minYear', { ...context, minYear: String(minYear) });
};
