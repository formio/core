import _ from 'lodash';

import { ValidatorError, FieldError } from 'error';
import { DayComponent, RuleFn } from 'types';
import { dayjs, isPartialDay, getDateValidationFormat, getDateSetting } from 'utils/date';

import { getComponentErrorField } from 'validation/util';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return component && component.type === 'day' && component.hasOwnProperty('maxDate');
};

export const validateMaximumDay: RuleFn = async (component, data, config) => {
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
    // TODO: this validation probably goes for dates and days
    const format = getDateValidationFormat(component);
    const date = dayjs(value, format);
    const maxDate = getDateSetting(component.maxDate);

    if (maxDate === null) {
        return null;
    } else {
        maxDate.setHours(0, 0, 0, 0);
    }
    const error = new FieldError({
        component,
        errorKeyOrMessage: 'maxDay',
        field: getComponentErrorField(component),
        context: config?.context,
    });
    return date.isBefore(dayjs(maxDate)) || date.isSame(dayjs(maxDate)) ? null : error;
};
