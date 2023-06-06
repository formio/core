import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { DayComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../../validator/util';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component?.type === 'day' &&
        (component.hasOwnProperty('minYear') || component.year?.hasOwnProperty('minYear'))
    );
};

export const validateMinimumYear: RuleFn = async (component, data) => {
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
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
        : new FieldError(
              component,
              getErrorMessage(component, `should not contain a year less than ${minYear}`)
          );
};
