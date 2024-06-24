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
        (component as TextAreaComponent).as !== 'json'
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
      return !!component.multiple;
    case 'tags':
      return (component as TagsComponent).storeas !== 'string';
    default:
      return false;
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

export const validateMultipleSync: RuleFnSync = (
  context: ValidationContext
) => {
  const { component, value } = context;
  // Skip multiple validation if the component tells us to
  if (!isEligible(component)) {
    return null;
  }

  const shouldBeArray = !!component.multiple;
  const isRequired = !!component.validate?.required;
  const isArray = Array.isArray(value);

  if (shouldBeArray) {
    if (isArray) {
      return isRequired
        ? value.length > 0
          ? null
          : new FieldError('array_nonempty', { ...context, setting: true })
        : null;
    } else {
      const error = new FieldError('array', { ...context, setting: true });
      // Null/undefined is ok if this value isn't required; anything else should fail
      return isNil(value) ? (isRequired ? error : null) : error;
    }
  } else {
    const canBeArray = emptyValueIsArray(component);
    if (!canBeArray && isArray) {
      return new FieldError('nonarray', { ...context, setting: false });
    }
    return null;
  }
};

export const validateMultipleInfo: ProcessorInfo<
  ValidationContext,
  FieldError | null
> = {
  name: 'validateMultiple',
  process: validateMultiple,
  fullValue: true,
  processSync: validateMultipleSync,
  shouldProcess: shouldValidate,
};
