import _ from 'lodash';
import moment from 'moment';

import { ValidatorError } from '../../error/ValidatorError';
import { DayComponent } from '../../types/Component';
import { RuleFn } from '../../types/RuleFn';
import { getErrorMessage } from '../../validator/util';
import { FieldError } from '../../error/FieldError';
import { isPartialDay, getDateValidationFormat, getDateSetting } from '../../validator/util';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return component && component.type === 'day' && component.hasOwnProperty('minDate');
};

export const validateMinimumDay: RuleFn = async (component, data) => {
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
        ? moment(value, getDateValidationFormat(component))
        : moment(value);
    const minDate = getDateSetting(component.minDate);

    if (minDate === null) {
        return null;
    } else {
        minDate.setHours(0, 0, 0, 0);
    }
    const error = new FieldError(
        component,
        getErrorMessage(component, `should not contain date before ${minDate}`)
    );
    return date.isAfter(minDate) || date.isSame(minDate) ? null : error;
};
