import {
  ProcessorFn,
  ProcessorFnSync,
  ConditionsScope,
  ProcessorInfo,
  DefaultValueContext,
} from 'types';
import { set, has } from 'lodash';
import { evaluate } from 'utils';
import { getComponentKey } from 'utils/formUtil';

export const hasCustomDefaultValue = (context: DefaultValueContext): boolean => {
  const { component } = context;
  if (!component.customDefaultValue) {
    return false;
  }
  return true;
};

export const hasServerDefaultValue = (context: DefaultValueContext): boolean => {
  const { component } = context;
  if (!component.hasOwnProperty('defaultValue')) {
    return false;
  }
  return true;
};

export const hasDefaultValue = (context: DefaultValueContext): boolean => {
  return hasCustomDefaultValue(context) || hasServerDefaultValue(context);
};

export const customDefaultValueProcess: ProcessorFn<ConditionsScope> = async (
  context: DefaultValueContext,
) => {
  return customDefaultValueProcessSync(context);
};

export const customDefaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (
  context: DefaultValueContext,
) => {
  const { component, row, data, scope, path } = context;
  if (!hasCustomDefaultValue(context)) {
    return;
  }
  if (!scope.defaultValues) scope.defaultValues = [];
  if (has(row, getComponentKey(component))) {
    return;
  }
  let defaultValue = null;
  if (component.customDefaultValue) {
    defaultValue = evaluate(
      component.customDefaultValue,
      context,
      'value',
      false,
      (context) => (context.value = null),
    );
    if (component.multiple && !Array.isArray(defaultValue)) {
      defaultValue = defaultValue ? [defaultValue] : [];
    }
    scope.defaultValues.push({
      path,
      value: defaultValue,
    });
  }
  if (defaultValue !== null && defaultValue !== undefined) {
    set(data, path, defaultValue);
  }
};

export const serverDefaultValueProcess: ProcessorFn<ConditionsScope> = async (
  context: DefaultValueContext,
) => {
  return serverDefaultValueProcessSync(context);
};

export const serverDefaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (
  context: DefaultValueContext,
) => {
  const { component, row, data, scope, path } = context;
  if (!hasServerDefaultValue(context)) {
    return;
  }
  if (!scope.defaultValues) scope.defaultValues = [];
  if (has(row, getComponentKey(component))) {
    return;
  }
  let defaultValue = null;

  // do not set false default values on server to provide compatibility with 8.x
  if (component.defaultValue) {
    defaultValue = component.defaultValue;
    if (component.multiple && !Array.isArray(defaultValue)) {
      defaultValue = defaultValue ? [defaultValue] : [];
    }
    scope.defaultValues.push({
      path,
      value: defaultValue,
    });
  }
  if (defaultValue) {
    set(data, path, defaultValue);
  }
};

export const defaultValueProcess: ProcessorFn<ConditionsScope> = async (
  context: DefaultValueContext,
) => {
  return defaultValueProcessSync(context);
};

export const defaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (
  context: DefaultValueContext,
) => {
  customDefaultValueProcessSync(context);
  serverDefaultValueProcessSync(context);
};

export const customDefaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
  name: 'customDefaultValue',
  process: customDefaultValueProcess,
  processSync: customDefaultValueProcessSync,
  shouldProcess: hasCustomDefaultValue,
};

export const serverDefaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
  name: 'serverDefaultValue',
  process: serverDefaultValueProcess,
  processSync: serverDefaultValueProcessSync,
  shouldProcess: hasServerDefaultValue,
};

export const defaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
  name: 'defaultValue',
  process: defaultValueProcess,
  processSync: defaultValueProcessSync,
  shouldProcess: hasDefaultValue,
};
