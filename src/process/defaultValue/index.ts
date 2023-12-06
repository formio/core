import JSONLogic from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, DefaultValueContext } from 'types';
import has from 'lodash/has';
import set from 'lodash/set';
const Evaluator = JSONLogic.evaluator;

export const hasDefaultValue = (context: DefaultValueContext): boolean => {
    const { component } = context;
    if (!component.hasOwnProperty('defaultValue') || !component.customDefaultValue) {
        return false;
    }
    return true;
};

export const defaultValueProcess: ProcessorFn<ConditionsScope> = async (context: DefaultValueContext) => {
    return defaultValueProcessSync(context);
};

export const defaultValueProcessSync: ProcessorFnSync<ConditionsScope> = (context: DefaultValueContext) => {
    const { component, row, evalContext } = context;
    if (has(row, component.key)) {
        return;
    }
    let defaultValue;
    if (component.defaultValue) {
        defaultValue = component.defaultValue;
    }
    else if (component.customDefaultValue) {
        const evalContextValue = evalContext ? evalContext(context) : context;
        defaultValue = Evaluator.evaluate(component.customDefaultValue, evalContextValue, 'value');
    }
    set(row, component.key, defaultValue);
};

export const defaultValueProcessInfo: ProcessorInfo<DefaultValueContext, void> = {
    name: 'defaultValue',
    process: defaultValueProcess,
    processSync: defaultValueProcessSync,
    shouldProcess: hasDefaultValue,
};
