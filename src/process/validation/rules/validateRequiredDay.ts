import { FieldError, ProcessorError } from 'error';
import { DayComponent, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableDayComponent = (component: any): component is DayComponent => {
    return (
        component &&
        component.type === 'day' &&
        component.fields.day &&
        component.fields.day.required
    );
};

export const shouldValidate = (context: ValidationContext) => {
    const { component } = context;
    if (!isValidatableDayComponent(component)) {
        return false;
    }
    return true;
};

export const validateRequiredDay: RuleFn = async (context: ValidationContext) => {
    return validateRequiredDaySync(context);
};

export const validateRequiredDaySync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    if (!value) {
        return new FieldError('requiredDayEmpty', context);
    }
    if (typeof value !== 'string') {
        throw new ProcessorError(
            `Cannot validate required day field of ${value} because it is not a string`,
            context,
            'validate:validateRequiredDay'
        );
    }
    const [DAY, MONTH, YEAR] = (component as DayComponent).dayFirst ? [0, 1, 2] : [1, 0, 2];
    const values = value.split('/').map((x) => parseInt(x, 10)),
        day = values[DAY],
        month = values[MONTH],
        year = values[YEAR];

    if (!day && (component as DayComponent).fields.day.required === true) {
        return new FieldError('requiredDayField', context);
    }
    if (!month && (component as DayComponent).fields.month.required === true) {
        return new FieldError('requiredMonthField', context);
    }
    if (!year && (component as DayComponent).fields.year.required === true) {
        return new FieldError('requiredYearField', context);
    }
    return null;
};

export const validateRequiredDayInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateRequiredDay',
    process: validateRequiredDay,
    processSync: validateRequiredDaySync,
    shouldProcess: shouldValidate,
};
