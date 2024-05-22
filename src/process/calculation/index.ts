import { JSONLogicEvaluator } from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, CalculationScope, CalculationContext, ProcessorInfo, FilterScope } from 'types';
import { set } from 'lodash';

export const shouldCalculate = (context: CalculationContext): boolean => {
    const { component, config } = context;
    if (
        !component.calculateValue ||
        (config?.server && !component.calculateServer)
    ) {
        return false;
    }
    return true;
};

export const calculateProcessSync: ProcessorFnSync<CalculationScope> = (context: CalculationContext) => {
    const { component, data, evalContext, scope, path, value } = context;
    if (!shouldCalculate(context)) {
        return;
    }
    const evalContextValue = evalContext ? evalContext(context) : context;
    evalContextValue.value = value || null;
    if (!scope.calculated) scope.calculated = [];
    let newValue = JSONLogicEvaluator.evaluate(component.calculateValue, evalContextValue, 'value');

    // Only set a new value if it is not "null" which would be the case if no calculation occurred.
    if (newValue !== null) {
        scope.calculated.push({
            path,
            value: newValue
        });
        set(data, path, newValue);
    }
    return;
};

export const calculateProcess: ProcessorFn<CalculationScope> = async (context: CalculationContext) => {
    return calculateProcessSync(context);
};

export const calculateProcessInfo: ProcessorInfo<CalculationContext, void> = {
    name: 'calculate',
    process: calculateProcess,
    processSync: calculateProcessSync,
    shouldProcess: shouldCalculate,
};
