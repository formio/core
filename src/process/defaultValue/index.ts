import JSONLogic from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, DefaultValueContext } from 'types';
import has from 'lodash/has';
import set from 'lodash/set';
const Evaluator = JSONLogic.evaluator;

export const hasCustomDefaultValue = (context: DefaultValueContext): boolean => {
    const { component } = context;
    if (!component.customDefaultValue) {
        return false;
    }
    return true;
};

export const hasSimpleDefaultValue = (context: DefaultValueContext): boolean => {
    const { component } = context;
    if (!component.hasOwnProperty('defaultValue')) {
        return false;
    }
    return true;
};

export const hasDefaultValue = (context: DefaultValueContext): boolean => {
    return hasSimpleDefaultValue(context) || hasCustomDefaultValue(context);
};

export const defaultValueProcess: ProcessorFn<ConditionsScope> = async (context: DefaultValueContext) => {
    return defaultValueProcessSync(context);
};

export const defaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (context: DefaultValueContext) => {
    const { component, row, evalContext, scope, path } = context;
    if (!scope.defaultValues) scope.defaultValues = [];
    if (has(row, component.key)) {
        return;
    }
    let defaultValue = null;
    if (component.defaultValue) {
        defaultValue = component.defaultValue;
        scope.defaultValues.push({
            path,
            value: defaultValue
        });
    }
    else if (component.customDefaultValue) {
        const evalContextValue = evalContext ? evalContext(context) : context;
        evalContextValue.value = null;
        defaultValue = Evaluator.evaluate(component.customDefaultValue, evalContextValue, 'value');
        scope.defaultValues.push({
            path,
            value: defaultValue
        });
    }
    set(row, component.key, defaultValue);
};

export const defaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
    name: 'defaultValue',
    process: defaultValueProcess,
    processSync: defaultValueProcessSync,
    shouldProcess: hasSimpleDefaultValue,
};

export const customDefaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
    name: 'customDefaultValue',
    process: defaultValueProcess,
    processSync: defaultValueProcessSync,
    shouldProcess: hasCustomDefaultValue,
};