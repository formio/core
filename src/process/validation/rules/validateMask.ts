import { isEmpty } from 'lodash';
import { FieldError } from 'error';
import { TextFieldComponent, DataObject, RuleFn, RuleFnSync, ValidationContext } from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';
import InputMask from 'inputmask';

const isMaskType = (obj: any): obj is DataObject & { maskName: string; value: string } => {
    return (
        obj?.maskName &&
        typeof obj?.maskName === 'string' &&
        obj?.value &&
        typeof obj?.value === 'string'
    );
};

const isValidatableComponent = (component: any): component is TextFieldComponent => {
    // For some reason we skip mask validation for time components
    return ((component && component.type && component.type !== 'time') &&
        (component && component.hasOwnProperty('inputMask') && !!component.inputMask) ||
        (component && component.hasOwnProperty('inputMasks') && !isEmpty(component.inputMasks))
    );
};

function getMaskByLabel(component: TextFieldComponent, maskName: string | undefined) {
    if (maskName) {
        const inputMask = component.inputMasks?.find((inputMask) => {
            return inputMask.label === maskName;
        });
        return inputMask ? inputMask.mask : undefined;
    }
    return;
}

function getInputMask(mask: string | string[], placeholderChar?: string) {
    if (mask instanceof Array) {
        return mask;
    }
    const maskArray: (string | RegExp)[] = [];
    for (let i = 0; i < mask.length; i++) {
        switch (mask[i]) {
            case '9':
                maskArray.push(/\d/);
                break;
            case 'A':
                maskArray.push(/[a-zA-Z]/);
                break;
            case 'a':
                maskArray.push(/[a-z]/);
                break;
            case '*':
                maskArray.push(/[a-zA-Z0-9]/);
                break;
            // If char which is used inside mask placeholder was used in the mask, replace it with space to prevent errors
            case placeholderChar:
                maskArray.push(' ');
                break;
            default:
                maskArray.push(mask[i]);
                break;
        }
    }
    return maskArray;
}

export function matchInputMask(value: any, inputMask: any) {
    if (!inputMask) {
        return true;
    }

    // If value is longer than mask, it isn't valid.
    if (value.length > inputMask.length) {
        return false;
    }

    for (let i = 0; i < inputMask.length; i++) {
        const char = value[i];
        const charPart = inputMask[i];

        if (charPart instanceof RegExp) {
            if (!charPart.test(char)) {
                return false;
            }
            continue;
        } else if (charPart !== char) {
            return false;
        }
    }

    return true;
}

export const shouldValidate = (context: ValidationContext) => {
    const { component, value } = context;
    if (!isValidatableComponent(component) || !value) {
        return false;
    }
    if (value == null) {
        return false;
    }
    if (component.allowMultipleMasks && (component as TextFieldComponent).inputMasks?.length) {
        const mask = value && isMaskType(value) ? value : undefined;
        const formioInputMask = getMaskByLabel(component as TextFieldComponent, mask?.maskName);
        if (formioInputMask && !getInputMask(formioInputMask)) {
            return false;
        }
    } else if (!getInputMask((component as TextFieldComponent).inputMask || '')) {
        return false;
    }
    return true;
};

export const validateMask: RuleFn = async (context: ValidationContext) => {
    return validateMaskSync(context);
};

// TODO: this function has side effects
export const validateMaskSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    if (!shouldValidate(context)) {
        return null;
    }
    let inputMask: string | string[] | undefined;
    let maskValue: string | undefined;
    if (component.allowMultipleMasks && (component as TextFieldComponent).inputMasks?.length) {
        const mask = value && isMaskType(value) ? value : undefined;
        const formioInputMask = getMaskByLabel(component as TextFieldComponent, mask?.maskName);
        if (formioInputMask) {
            inputMask = formioInputMask;
        }
        maskValue = mask?.value;
    } else {
        inputMask = (component as TextFieldComponent).inputMask || '';
    }
    if (!inputMask) {
        return null;
    }
    if (value && inputMask && typeof value === 'string' && component.type === 'textfield') {
        return InputMask.isValid(value, {mask: inputMask.toString()}) ? null : new FieldError('mask', context);
    }
    let inputMaskArr = getInputMask(inputMask);
    if (value != null && inputMaskArr) {
        const error = new FieldError('mask', context);
        return matchInputMask(maskValue || value, inputMaskArr) ? null : error;
    }
    return null;
};

export const validateMaskInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
    name: 'validateMask',
    process: validateMask,
    processSync: validateMaskSync,
    shouldProcess: shouldValidate,
};
