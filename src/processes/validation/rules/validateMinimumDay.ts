import _ from 'lodash';

import { ValidatorError, FieldError } from 'error';
import { DayComponent, RuleFn } from 'types';
import { dayjs, isPartialDay, getDateValidationFormat, getDateSetting } from 'utils/date';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return component && component.type === 'day' && component.hasOwnProperty('minDate');
};

export const validateMinimumDay: RuleFn = async (context) => {
    const { component, data } = context;
    if (!isValidatableDayComponent(component)) {
        return null;
    }
    const value = _.get(data, component.key);
    if (typeof value !== 'string') {
        throw new ValidatorError(`Cannot validate day value ${value} because it is not a string`);
    }
    if (isPartialDay(component, value)) {
        return null;
    }

    const date = getDateValidationFormat(component)
        ? dayjs(value, getDateValidationFormat(component))
        : dayjs(value);
    const minDate = getDateSetting(component.minDate);

    if (minDate === null) {
        return null;
    } else {
        minDate.setHours(0, 0, 0, 0);
    }
    const error = new FieldError('minDay', context);
    return date.isAfter(minDate) || date.isSame(minDate) ? null : error;
};
