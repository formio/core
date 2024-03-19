import { FieldError } from '../../../error/FieldError';
import { RuleFn, ValidationContext } from '../../../types/index';
import { ProcessorError } from 'error';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

export const shouldValidate = (context: ValidationContext) => {
    const { component } = context;
    if (component.type === 'recaptcha') {
        return true;
    }
    return false;
};

export const validateCaptcha: RuleFn = async (context: ValidationContext) => {
    const { value, config, component } = context;
    if (!shouldValidate(context)) {
        return null;
    }

    if (!config || !config.database) {
        throw new ProcessorError("Can't test for recaptcha success without a database config object", context, 'validate:validateCaptcha');
    }
    try {
        if (!value || !value.token) {
            return new FieldError('captchaTokenNotSpecified', context);
        }
        if (!value.success) {
            return new FieldError('captchaTokenValidation', context);
        }
        const captchaResult: boolean = await config.database?.validateCaptcha(value.token);
        return (captchaResult === true) ? null : new FieldError('captchaFailure', context);
    }
    catch (err: any) {
        throw new ProcessorError(err.message || err, context, 'validate:validateCaptcha');
    }
};

export const validateCaptchaInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateCaptcha',
    process: validateCaptcha,
    shouldProcess: shouldValidate,
};
