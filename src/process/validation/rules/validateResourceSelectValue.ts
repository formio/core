import { FieldError, ProcessorError } from 'error';
import { SelectComponent, RuleFn, ValidationContext } from 'types';
import { isEmptyObject, toBoolean } from '../util';
import { ProcessorInfo } from 'types/process/ProcessorInfo';

const isValidatableSelectComponent = (component: any): component is SelectComponent => {
  return (
    component &&
    component.type === 'select' &&
    toBoolean(component.dataSrc === 'resource') &&
    toBoolean(component.validate?.select)
  );
};

export const generateUrl = (baseUrl: URL, component: SelectComponent, value: any) => {
  const url = baseUrl;
  const query = url.searchParams;
  if (component.searchField) {
    let searchValue = value;
    if (component.valueProperty) {
      searchValue = value[component.valueProperty];
    } else {
      searchValue = value;
    }
    query.set(
      component.searchField,
      typeof searchValue === 'string' ? searchValue : JSON.stringify(searchValue),
    );
  }
  if (component.selectFields) {
    query.set('select', component.selectFields);
  }
  if (component.sort) {
    query.set('sort', component.sort);
  }
  if (component.filter) {
    const filterQueryStrings = new URLSearchParams(component.filter);
    filterQueryStrings.forEach((value, key) => query.set(key, value));
  }
  return url;
};

export const shouldValidate = (context: ValidationContext) => {
  const { component, value, config } = context;
  // Only run this validation if server-side
  if (!config?.server) {
    return false;
  }
  if (!isValidatableSelectComponent(component)) {
    return false;
  }
  if (
    !value ||
    isEmptyObject(value) ||
    (Array.isArray(value) && (value as Array<Record<string, any>>).length === 0)
  ) {
    return false;
  }

  // If given an invalid configuration, do not validate the remote value
  if (component.dataSrc !== 'resource' || !component.data?.resource) {
    return false;
  }

  return true;
};

export const validateResourceSelectValue: RuleFn = async (context: ValidationContext) => {
  const { value, config } = context;
  if (!shouldValidate(context)) {
    return null;
  }

  if (!config || !config.database) {
    throw new ProcessorError(
      "Can't validate for resource value without a database config object",
      context,
      'validate:validateResourceSelectValue',
    );
  }
  try {
    const resourceSelectValueResult: boolean = await config.database?.validateResourceSelectValue(
      context,
      value,
    );
    return resourceSelectValueResult === true ? null : new FieldError('select', context);
  } catch (err: any) {
    throw new ProcessorError(err.message || err, context, 'validate:validateResourceSelectValue');
  }
};

export const validateResourceSelectValueInfo: ProcessorInfo<ValidationContext, FieldError | null> =
  {
    name: 'validateResourceSelectValue',
    process: validateResourceSelectValue,
    shouldProcess: shouldValidate,
  };
