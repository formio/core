import { reset } from 'fetch-mock';
import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, ConditionsContext, SimpleConditional, JSONConditional, LegacyConditional, SimpleConditionalConditions, Component, NestedComponent, FilterScope } from 'types';
import { registerEphermalState, resetEphermalState } from 'utils';
import {
    checkCustomConditional,
    checkJsonConditional,
    checkLegacyConditional,
    checkSimpleConditional,
    isLegacyConditional,
    isSimpleConditional,
    isJSONConditional
} from 'utils/conditions';


const hasCustomConditions = (context: ConditionsContext): boolean => {
    const { component } = context;
    return !!component.customConditional;
}

const hasSimpleConditions = (context: ConditionsContext): boolean => {
    const { component } = context;
    const { conditional } = component;
    if (
        isLegacyConditional(conditional) ||
        isSimpleConditional(conditional) ||
        isJSONConditional(conditional)
    ) {
        return true;
    }
    return false;
}

export const hasConditions = (context: ConditionsContext): boolean => {
    return hasSimpleConditions(context) || hasCustomConditions(context);
};

export const isCustomConditionallyHidden = (context: ConditionsContext): boolean => {
    if (!hasCustomConditions(context)) {
        return false;
    }
    const { component } = context;
    const { customConditional } = component;
    let show: boolean | null = null;
    if (customConditional) {
        show = checkCustomConditional(customConditional, context, 'show');
    }
    if (show === null) {
        return false;
    }
    return !show;
};

export const isSimpleConditionallyHidden = (context: ConditionsContext): boolean => {
    if (!hasSimpleConditions(context)) {
        return false;
    }
    const { component } = context;
    const { conditional } = component;
    let show: boolean | null = null;
    if (isJSONConditional(conditional)) {
        show = checkJsonConditional(conditional, context);
    }
    if (isLegacyConditional(conditional)) {
        show = checkLegacyConditional(conditional, context);
    }
    if (isSimpleConditional(conditional)) {
        show = checkSimpleConditional(conditional, context);
    }
    if (show === null || show === undefined) {
        return false;
    }
    return !show;
};

export const isConditionallyHidden = (context: ConditionsContext): boolean => {
    return isCustomConditionallyHidden(context) || isSimpleConditionallyHidden(context);
};

export type ConditionallyHidden = (context: ConditionsContext) => boolean;

export const conditionalProcess = (context: ConditionsContext, isHidden: ConditionallyHidden) => {
    const { scope, path } = context;
    if (!hasConditions(context)) {
        return;
    }

    if (!scope.conditionals) {
        scope.conditionals = [];
    }
    let conditionalComp = scope.conditionals.find((cond) => (cond.path === path));
    if (!conditionalComp) {
        conditionalComp = {path, conditionallyHidden: false};
        scope.conditionals.push(conditionalComp);
    }

    conditionalComp.conditionallyHidden = conditionalComp.conditionallyHidden || isHidden(context) === true;
    if (conditionalComp.conditionallyHidden) {
        registerEphermalState(context.component, 'conditionallyHidden', true);
    }
};

export const customConditionProcess: ProcessorFn<ConditionsScope> = async (context: ConditionsContext) => {
    return customConditionProcessSync(context);
};

export const customConditionProcessSync: ProcessorFnSync<ConditionsScope> = (context: ConditionsContext) => {
    return conditionalProcess(context, isCustomConditionallyHidden);
};

export const simpleConditionProcess: ProcessorFn<ConditionsScope> = async (context: ConditionsContext) => {
    return simpleConditionProcessSync(context);
};

export const simpleConditionProcessSync: ProcessorFnSync<ConditionsScope> = (context: ConditionsContext) => {
    return conditionalProcess(context, isSimpleConditionallyHidden);
};

export const conditionProcess: ProcessorFn<ConditionsScope> = async (context: ConditionsContext) => {
    return conditionProcessSync(context);
};

export const conditionProcessSync: ProcessorFnSync<ConditionsScope> = (context: ConditionsContext) => {
    return conditionalProcess(context, isConditionallyHidden);
};

export const customConditionProcessInfo: ProcessorInfo<ConditionsContext, void> = {
    name: 'customConditions',
    process: customConditionProcess,
    processSync: customConditionProcessSync,
    shouldProcess: hasCustomConditions,
};

export const simpleConditionProcessInfo: ProcessorInfo<ConditionsContext, void> = {
    name: 'simpleConditions',
    process: simpleConditionProcess,
    processSync: simpleConditionProcessSync,
    shouldProcess: hasSimpleConditions,
};

export const conditionProcessInfo: ProcessorInfo<ConditionsContext, void> = {
    name: 'conditions',
    process: conditionProcess,
    processSync: conditionProcessSync,
    shouldProcess: hasSimpleConditions,
};
