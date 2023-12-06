import JSONLogic from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, ConditionsContext } from 'types';
import { Utils } from 'utils';
import get from 'lodash/get';
import has from 'lodash/has';
import unset from 'lodash/unset';
import isArray from 'lodash/isArray';
const Evaluator = JSONLogic.evaluator;

export const hasConditions = (context: ConditionsContext): boolean => {
    const { component } = context;
    const { conditional, customConditional } = component;
    // For server evaluations, we are only concerned with conditions if they have clearOnHide set.
    if (typeof window === 'undefined' && !component.clearOnHide) {
        return false;
    }
    if (!(conditional?.when || conditional?.json) && !customConditional) {
        return false;
    }
    return true;
};

export const isConditionallyHidden = (context: ConditionsContext): boolean => {
    const { components, data, component, evalContext } = context;
    const { conditional, customConditional } = component;
    const evalContextValue = evalContext ? evalContext(context) : context;
    if (customConditional) {
        return !Evaluator.evaluate(customConditional, evalContextValue, 'show');
    }
    if (conditional && conditional.json) {
        return !JSONLogic.jsonLogic.apply(conditional.json, evalContextValue);
    }
    if (conditional && conditional.when && components) {
        const compData = Utils.getComponentData(components, data, conditional.when);
        if (compData.component) {
            const compValue: any = get(compData.data, compData.component.key);
            const eq: string = String(conditional.eq);
            const show = String(conditional.show);
            if (compValue && has(compValue, eq)) {
                return String(compValue[eq]) === show;
            }
            if (isArray(compValue) && compValue.map(String).includes(eq)) {
                return show === 'true';
            }
            return (String(compValue) === eq) === (show === 'true');
        }
    }
    return false;
};

export const conditionProcess: ProcessorFn<ConditionsScope> = async (context: ConditionsContext) => {
    return conditionProcessSync(context);
};

export const conditionProcessSync: ProcessorFnSync<ConditionsScope> = (context: ConditionsContext) => {
    const { component, row } = context;
    component.isConditionallyHidden = isConditionallyHidden(context);
    if (component.isConditionallyHidden && component.clearOnHide) {
        unset(row, component.key);
    }
};

export const conditionProcessInfo: ProcessorInfo<ConditionsContext, void> = {
    name: 'conditions',
    process: conditionProcess,
    processSync: conditionProcessSync,
    shouldProcess: () => true,
};