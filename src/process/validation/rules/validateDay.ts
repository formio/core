import { FieldError } from 'error';
import { DayComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isLeapYear = (year: number) => {
    // Year is leap if it is evenly divisible by 400 or evenly divisible by 4 and not evenly divisible by 100.
    return !(year % 400) || (!!(year % 100) && !(year % 4));
};

const getDaysInMonthCount = (month: number, year: number) => {
    switch (month) {
        case 1: // January
        case 3: // March
        case 5: // May
        case 7: // July
        case 8: // August
        case 10: // October
        case 12: // December
            return 31;
        case 4: // April
        case 6: // June
        case 9: // September
        case 11: // November
            return 30;
        case 2: // February
            return isLeapYear(year) ? 29 : 28;
        default:
            return 31;
    }
};

const isDayComponent = (component: any): component is DayComponent => {
    return component && component.type === 'day';
};

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!value) {
        return false;
    }
    if (!isDayComponent(component)) {
        return false;
    }
    return true;
};

export const validateDay: RuleFn = async (context: ValidationContext) => {
    return validateDaySync(context);
};

export const validateDaySync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    const error = new FieldError('invalidDay', context, 'day');
    if (typeof value !== 'string') {
        return error;
    }
    const [DAY, MONTH, YEAR] = (component as DayComponent).dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/').map((x) => parseInt(x, 10)),
        day = values[DAY],
        month = values[MONTH],
        year = values[YEAR],
        maxDay = getDaysInMonthCount(month, year);

    if (isNaN(day) || day < 0 || day > maxDay) {
        return error;
    }
    if (isNaN(month) || month < 0 || month > 12) {
        return error;
    }
    if (isNaN(year) || year < 0 || year > 9999) {
        return error;
    }
    return null;
};

export const validateDayInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateDay',
    process: validateDay,
    processSync: validateDaySync,
    shouldProcess: shouldValidate
};
