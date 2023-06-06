import _ from 'lodash';

import { FieldError } from '../../error/FieldError';
import { ValidatorError } from '../../error/ValidatorError';
import { DayComponent } from '../../types/Component';
import { RuleFn } from '../../types/index';
import { getErrorMessage } from '../util';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component.type === 'day' &&
        component.fields.day &&
        component.fields.day.required
    );
};

export const validateRequiredDay: RuleFn = async (component, data) => {
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (!value) {
        return new FieldError(
            component,
            getErrorMessage(component, 'does not contain required fields')
        );
    }
    if (typeof value !== 'string') {
        throw new ValidatorError(
            `Cannot validate required day field of ${value} because it is not a string`
        );
    }
    const [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/').map((x) => parseInt(x, 10)),
        day = values[DAY],
        month = values[MONTH],
        year = values[YEAR];

    if (!day && component.fields.day.required === true) {
        return new FieldError(component, getErrorMessage(component, 'requires a day field'));
    }
    if (!month && component.fields.month.required === true) {
        return new FieldError(component, getErrorMessage(component, 'requires a month field'));
    }
    if (!year && component.fields.year.required === true) {
        return new FieldError(component, getErrorMessage(component, 'requires a year field'));
    }
    return null;
};
