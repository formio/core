import { isNil } from 'lodash';
import { FieldError } from 'error';
import {
  Component,
  TextAreaComponent,
  RuleFn,
  TagsComponent,
  RuleFnSync,
  ValidationContext,
} from 'types';
import { ProcessorInfo } from 'types/process/ProcessorInfo';
import { getModelType } from 'utils/formUtil';

export const isEligible = (component: Component) => {
  // TODO: would be nice if this was type safe
  switch (component.type) {
    case 'hidden':
    case 'address':
      if (!component.multiple) {
        return false;
      }
      return true;
    case 'textarea':
      if (
        !(component as TextAreaComponent).as ||
        (component as TextAreaComponent).as !== 'json' ||
        ((component as TextAreaComponent).as === 'json' && !component.multiple)
      ) {
        return false;
      }
      return true;
    // TODO: For backwards compatibility, skip multiple validation for select components until we can investigate
    // how this validation might break existing forms
    case 'select':
      return false;
    default:
      return true;
  }
};

const isTagsComponent = (component: any): component is TagsComponent => {
  return component?.type === 'tags';
};

export const emptyValueIsArray = (component: Component) => {
  // TODO: How do we infer the data model of the compoennt given only its JSON? For now, we have to hardcode component types
  switch (component.type) {
    case 'datagrid':
    case 'editgrid':
    case 'tagpad':
    case 'sketchpad':
    case 'datatable':
    case 'dynamicWizard':
    case 'file':
      return true;
    case 'select':
    case 'textfield':
      return !!component.multiple;
    case 'tags':
      return (component as TagsComponent).storeas !== 'string';
    default:
      return true;
  }
};

export const shouldValidate = (context: ValidationContext) => {
  const { component } = context;
  if (!isEligible(component)) {
    return false;
  }
  return true;
};

export const validateMultiple: RuleFn = async (context: ValidationContext) => {
  return validateMultipleSync(context);
};

export const validateMultipleSync: RuleFnSync = (context: ValidationContext) => {
  const { component, value } = context;
  // Skip multiple validation if the component tells us to
  if (!isEligible(component)) {
    return null;
  }

  const shouldBeMultipleArray = !!component.multiple;
  const isRequired = !!component.validate?.required;
  const compModelType = getModelType(component);
  const underlyingValueShouldBeArray =
    ['nestedArray', 'nestedDataArray'].indexOf(compModelType) !== -1 ||
    (isTagsComponent(component) && component.storeas === 'array');
  const valueIsArray = Array.isArray(value);

  if (shouldBeMultipleArray) {
    if (valueIsArray && underlyingValueShouldBeArray) {
      if (value.length === 0) {
        return isRequired ? new FieldError('array_nonempty', { ...context, setting: true }) : null;
      }

      // TODO: We need to be permissive here for file components, which have an array model type but don't have an underlying array value
      // (in other words, a file component's data object will always be a single array regardless of whether or not multiple is set)
      // In the future, we could consider checking the underlying value's type to determine if it should be an array
      // return Array.isArray(value[0]) ? null : new FieldError('array', { ...context, setting: true });
      return null;
    } else if (valueIsArray && !underlyingValueShouldBeArray) {
      if (value.length === 0) {
        return isRequired ? new FieldError('array_nonempty', { ...context, setting: true }) : null;
      }

      return Array.isArray(value[0]) && compModelType !== 'any'
        ? new FieldError('nonarray', { ...context, setting: true })
        : null;
    } else {
      const error = new FieldError('array', { ...context, setting: true });
      // Null/undefined is ok if this value isn't required; anything else should fail
      return isNil(value) ? (isRequired ? error : null) : error;
    }
  } else {
    const canBeArray = emptyValueIsArray(component) || underlyingValueShouldBeArray;
    if (!canBeArray && valueIsArray) {
      return new FieldError('nonarray', { ...context, setting: false });
    }
    return null;
  }
};

export const validateMultipleInfo: ProcessorInfo<ValidationContext, FieldError | null> = {
  name: 'validateMultiple',
  process: validateMultiple,
  fullValue: true,
  processSync: validateMultipleSync,
  shouldProcess: shouldValidate,
};
