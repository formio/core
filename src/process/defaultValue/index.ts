import JSONLogic from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, DefaultValueContext, FilterScope } from 'types';
import has from 'lodash/has';
import set from 'lodash/set';
import { getComponentKey } from 'utils/formUtil';
const Evaluator = JSONLogic.evaluator;

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

export const customDefaultValueProcess: ProcessorFn<ConditionsScope> = async (context: DefaultValueContext) => {
    return customDefaultValueProcessSync(context);
};

export const customDefaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (context: DefaultValueContext) => {
    const { component, row, scope, evalContext, path } = context;
    if (!hasCustomDefaultValue(context)) {
        return;
    }
    if (!scope.defaultValues) scope.defaultValues = [];
    if (has(row, getComponentKey(component))) {
        return;
    }
    let defaultValue = null;
    if (component.customDefaultValue) {
        const evalContextValue = evalContext ? evalContext(context) : context;
        evalContextValue.value = null;
        defaultValue = Evaluator.evaluate(component.customDefaultValue, evalContextValue, 'value');
        if (component.multiple && !Array.isArray(defaultValue)) {
            defaultValue = defaultValue ? [defaultValue] : [];
        }
        scope.defaultValues.push({
            path,
            value: defaultValue
        });
    }
    if (defaultValue !== null && defaultValue !== undefined) {
        set(row, getComponentKey(component), defaultValue);
    }
};

export const serverDefaultValueProcess: ProcessorFn<ConditionsScope> = async (context: DefaultValueContext) => {
    return serverDefaultValueProcessSync(context);
};

export const serverDefaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (context: DefaultValueContext) => {
    const { component, row, scope, path } = context;
    if (!hasServerDefaultValue(context)) {
        return;
    }
    if (!scope.defaultValues) scope.defaultValues = [];
    if (has(row, getComponentKey(component))) {
        return;
    }
    let defaultValue = null;
    if (
        component.defaultValue !== undefined &&
        component.defaultValue !== null
    ) {
        defaultValue = component.defaultValue;
        if (component.multiple && !Array.isArray(defaultValue)) {
            defaultValue = defaultValue ? [defaultValue] : [];
        }
        scope.defaultValues.push({
            path,
            value: defaultValue
        });
    }
    if (defaultValue !== null && defaultValue !== undefined) {
        set(row, getComponentKey(component), defaultValue);
        context.value = defaultValue;
    }
};

export const defaultValueProcess: ProcessorFn<ConditionsScope> = async (context: DefaultValueContext) => {
    return defaultValueProcessSync(context);
};

export const defaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (context: DefaultValueContext) => {
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