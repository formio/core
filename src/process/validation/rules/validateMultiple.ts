import { isNil } from 'lodash';
import { FieldError } from 'error';
import { Component, TextAreaComponent, RuleFn, TagsComponent, RuleFnSync, ValidationContext } from 'types';

const isEligible = (component: Component) => {
    // TODO: would be nice if this was type safe
    switch (component.type) {
        case 'hidden':
        case 'select':
            return false;
        case 'address':
            if (!component.multiple) {
                return false;
            }
            break;
        case 'textArea':
            if (!(component as TextAreaComponent).as || (component as TextAreaComponent).as !== 'json') {
                return false;
            }
            break;
        default:
            return true;
    }
}

const emptyValueIsArray = (component: Component) => {
    // TODO: yikes, this could be better
    switch (component.type) {
        case 'datagrid':
        case 'editgrid':
        case 'file':
            return true;
        case 'select':
            return !!component.multiple;
        case 'tags':
            return (component as TagsComponent).storeas !== 'string';
        default:
            return false;
    }
}

export const validateMultiple: RuleFn = async (context: ValidationContext) => {
    return validateMultipleSync(context);
};

export const validateMultipleSync: RuleFnSync = (context: ValidationContext) => {
    const { component, value } = context;
    // Skip multiple validation if the component tells us to
    if (!isEligible(component)) {
        return null;
    }

    const shouldBeArray = !!component.multiple;
    const canBeArray = emptyValueIsArray(component);
    const isArray = Array.isArray(value);
    const isRequired = !!component.validate?.required;

    if (shouldBeArray) {
        if (isArray) {
            return isRequired ? value.length > 0 ? null : new FieldError('array_nonempty', context): null;
        } else {
            // Null/undefined is ok if this value isn't required; anything else should fail
            return isNil(value) ? isRequired ? new FieldError('array', context) : null : null;
        }
    } else {
        if (!canBeArray && isArray) {
            return new FieldError('nonarray', context);
        }
        return null;
    }
}
