import dayjs from 'dayjs';
import _ from 'lodash';

import { ValidatorError } from 'error/ValidatorError';
import { DayComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from 'validator/util';
import { FieldError } from '../../error/FieldError';
import { isPartialDay, getDateValidationFormat, getDateSetting } from 'utils/date'

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return component && component.type === 'day' && component.hasOwnProperty('maxDate');
};

export const validateMaximumDay: RuleFn = async (component, data) => {
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
    const date = getDateValidationFormat(component)
        ? moment(value, getDateValidationFormat(component))
        : moment(value);
    const maxDate = getDateSetting(component.maxDate);

    if (maxDate === null) {
        return null;
    } else {
        maxDate.setHours(0, 0, 0, 0);
    }
    const error = new FieldError(
        component,
        getErrorMessage(component, `should not contain date after ${maxDate}`)
    );
    return date.isBefore(maxDate) || date.isSame(maxDate) ? null : error;
};
