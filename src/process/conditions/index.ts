import JSONLogic from 'modules/jsonlogic';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, ConditionsContext, SimpleConditional, JSONConditional, LegacyConditional, SimpleConditionalConditions } from 'types';
import { Utils } from 'utils';
import get from 'lodash/get';
import has from 'lodash/has';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import isEmpty from 'lodash/isEmpty';
import some from 'lodash/some';
import every from 'lodash/every';
import unset from 'lodash/unset';
import isArray from 'lodash/isArray';
import ConditionOperators from './operators';
const Evaluator = JSONLogic.evaluator;

const isJSONConditional = (conditional: any): conditional is JSONConditional => {
    return conditional && conditional.json;
}

const isLegacyConditional = (conditional: any): conditional is LegacyConditional => {
    return conditional && conditional.when;
}

const isSimpleConditional = (conditional: any): conditional is SimpleConditional => {
    return conditional && conditional.conjunction && conditional.conditions;
}

export const hasConditions = (context: ConditionsContext): boolean => {
    const { component } = context;
    const { conditional, customConditional } = component;
    // For server evaluations, we are only concerned with conditions if they have clearOnHide set.
    if (typeof window === 'undefined' && !component.clearOnHide) {
        return false;
    }
    if (!isJSONConditional(conditional) && !isLegacyConditional(conditional) && !isSimpleConditional(conditional) && !customConditional) {
        return false;
    }
    return true;
};

export function getComponentActualValue(compPath: string, data: any, row: any) {
    let value = null;
    if (row) {
        value = get(row, compPath);
    }
    if (data && isNil(value)) {
        value = get(data, compPath);
    }
    // FOR-400 - Fix issue where falsey values were being evaluated as show=true
    if (isNil(value) || (isObject(value) && isEmpty(value))) {
        value = '';
    }
    return value;
}

export const isConditionallyHidden = (context: ConditionsContext): boolean => {
    const { components, data, row, component, instance, evalContext } = context;
    const { conditional, customConditional } = component;
    const evalContextValue = evalContext ? evalContext(context) : context;
    if (customConditional) {
        return !Evaluator.evaluate(customConditional, evalContextValue, 'show');
    }
    if (isJSONConditional(conditional)) {
        return !JSONLogic.jsonLogic.apply(conditional.json, evalContextValue);
    }
    if (isLegacyConditional(conditional) && conditional.when && components) {
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
    if (isSimpleConditional(conditional)) {
        const { conditions = [], conjunction = 'all', show = true } = conditional;
        if (!conditions.length) {
            return true;
        }

        const conditionsResult = map(conditions, (cond) => {
            const { value: comparedValue, operator, component: conditionComponentPath } = cond;
            if (!conditionComponentPath) {
                return true;
            }
            const value = getComponentActualValue(conditionComponentPath, data, row);

            const ConditionOperator = ConditionOperators[operator];
            return ConditionOperator
                ? new ConditionOperator().getResult({ value, comparedValue, instance, component, conditionComponentPath })
                : true;
        });

        let result = false;
        switch (conjunction) {
            case 'any':
                result = some(conditionsResult, res => !!res);
                break;
            default:
                result = every(conditionsResult, res => !!res);
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
    shouldProcess: hasConditions,
};