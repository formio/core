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
    const { component, row, evalContext, scope } = context;
    if (has(row, component.key)) {
        return;
    }
    if (component.defaultValue) {
        scope.defaultValue = component.defaultValue;
    }
    else if (component.customDefaultValue) {
        const evalContextValue = evalContext ? evalContext(context) : context;
        evalContextValue.value = null;
        scope.defaultValue = Evaluator.evaluate(component.customDefaultValue, evalContextValue, 'value');
    }
    set(row, component.key, scope.defaultValue);
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