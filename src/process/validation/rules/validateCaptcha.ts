import { FieldError } from '../../../error/FieldError';
import { RuleFn, ValidationContext } from '../../../types/index';
import { ValidatorError } from 'error';
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
        throw new ValidatorError("Can't test for recaptcha success without a database config object");
    }
    try {
        if (!value || !value.token) {
            return new FieldError('captchaTokenNotSpecified', context, 'catpcha');
        }
        if (!value.success) {
            return new FieldError('captchaTokenValidation', context, 'captcha');
        }
        const captchaResult: boolean = await config.database?.validateCaptcha(value.token);
        return (captchaResult === true) ? null : new FieldError('captchaFailure', context, 'captcha');
    }
    catch (err: any) {
        throw new ValidatorError(err.message || err);
    }
};

export const validateCaptchaInfo: ProcessorInfo<ValidationContext, FieldError | null>  = {
    name: 'validateCaptcha',
    process: validateCaptcha,
    shouldProcess: shouldValidate,
};
