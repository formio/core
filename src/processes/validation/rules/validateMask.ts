import _, { isEmpty } from 'lodash';

import { FieldError } from 'error';
import { TextFieldComponent, DataObject, RuleFn } from 'types';

const isMaskType = (obj: any): obj is DataObject & { maskName: string; value: string } => {
    return (
        obj?.maskName &&
        typeof obj?.maskName === 'string' &&
        obj?.value &&
        typeof obj?.value === 'string'
    );
};

const isValidatableTextComponent = (component: any): component is TextFieldComponent => {
    return (
        (component && component.hasOwnProperty('inputMask') && !!component.inputMask) ||
        (component.hasOwnProperty('inputMasks') && !isEmpty(component.inputMasks))
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

// TODO: this function has side effects
export const validateMask: RuleFn = async (context) => {
    const { component, data, path } = context;
    if (!isValidatableTextComponent(component)) {
        return null;
    }
    let inputMask: (string | RegExp)[] | undefined;
    let maskValue: string | undefined;
    const value = _.get(data, path);
    if (component.allowMultipleMasks && component.inputMasks?.length) {
        const mask = value && isMaskType(value) ? value : undefined;
        const formioInputMask = getMaskByLabel(component, mask?.maskName);
        if (formioInputMask) {
            inputMask = getInputMask(formioInputMask);
        }
        maskValue = mask?.value;
    } else {
        inputMask = getInputMask(component.inputMask || '');
    }
    if (value && inputMask) {
        const error = new FieldError('mask', context);
        return matchInputMask(maskValue || value, inputMask) ? null : error;
    }
    return null;
};
