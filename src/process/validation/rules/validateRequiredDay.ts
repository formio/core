import _ from 'lodash';

import { FieldError, ValidatorError } from 'error';
import { DayComponent, RuleFn } from 'types';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component.type === 'day' &&
        component.fields.day &&
        component.fields.day.required
    );
};

export const validateRequiredDay: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, path);
    if (!value) {
        const error = new FieldError('requiredDayEmpty', context);
    }
    if (typeof value !== 'string') {
        throw new ValidatorError(
            `Cannot validate required day field of ${value} because it is not a string`,
        );
    }
    const [DAY, MONTH, YEAR] = component.dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/').map((x) => parseInt(x, 10)),
        day = values[DAY],
        month = values[MONTH],
        year = values[YEAR];

    if (!day && component.fields.day.required === true) {
        return new FieldError('requiredDayField', context);
    }
    if (!month && component.fields.month.required === true) {
        return new FieldError('requiredMonthField', context);
    }
    if (!year && component.fields.year.required === true) {
        return new FieldError('requiredYearField', context);
    }
    return null;
};
