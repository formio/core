import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { DayComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../util';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component.type === 'day' &&
        (component.hasOwnProperty('maxYear') || component.fields?.year?.hasOwnProperty('maxYear'))
    );
};

export const validateMaximumYear: RuleFn = async (component, data) => {
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
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
            'Cannot validate maximum year, component.maxYear and component.fields.year.maxYear are not equal'
        );
    }
    const maxYear = component.maxYear || component.fields.year.maxYear;

    if (!maxYear || !year) {
        return null;
    }

    return +year <= +maxYear
        ? null
        : new FieldError(
              component,
              getErrorMessage(component, `should not contain a year greater than ${maxYear}`)
          );
};
