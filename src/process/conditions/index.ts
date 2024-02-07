import { ProcessorFn, ProcessorFnSync, ConditionsScope, ProcessorInfo, ConditionsContext, SimpleConditional, JSONConditional, LegacyConditional, SimpleConditionalConditions, Component, NestedComponent, FilterScope } from 'types';
import { Utils } from 'utils';
import unset from 'lodash/unset';
import { componentInfo, getComponentKey, getComponentPath } from 'utils/formUtil';
import { 
    checkCustomConditional, 
    checkJsonConditional, 
    checkLegacyConditional, 
    checkSimpleConditional,
    isLegacyConditional,
    isSimpleConditional,
    isJSONConditional
} from 'utils/conditions';
import { has } from 'lodash';

const skipOnServer = (context: ConditionsContext): boolean => {
    const { component, config } = context;
    const clearOnHide = component.hasOwnProperty('clearOnHide') ? component.clearOnHide : true;
    if (config?.server && !clearOnHide) {
        // No need to run conditionals on server unless clearOnHide is set.
        return true;
    }
    return false;
};

const hasCustomConditions = (context: ConditionsContext): boolean => {
    if (skipOnServer(context)) {
        return false;
    }
    const { component } = context;
    return !!component.customConditional;
}

const hasSimpleConditions = (context: ConditionsContext): boolean => {
    if (skipOnServer(context)) {
        return false;
    }
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
    if (skipOnServer(context)) {
        return false;
    }
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
    const { component, row, scope, path } = context;
    const conditionallyHidden = isHidden(context);
    if (!scope.conditionals) scope.conditionals = [];
    if (conditionallyHidden) {
        const info = componentInfo(component);
        if (info.hasColumns || info.hasComps || info.hasRows) {
            // If this is a container component, we need to add all the child components as conditionally hidden as well.
            Utils.eachComponentData([component], row, (comp: Component, data: any, compRow: any, compPath: string) => {
                scope.conditionals?.push({ path: getComponentPath(comp, compPath), conditionallyHidden: true });
                if (!comp.hasOwnProperty('clearOnHide') || comp.clearOnHide) {
                    unset(compRow, getComponentKey(comp));
                }
            });
        }
        else {
            scope.conditionals.push({ path, conditionallyHidden: true });
            if (!component.hasOwnProperty('clearOnHide') || component.clearOnHide) {
                unset(row, getComponentKey(component));
                context.value = undefined;
            }
        }
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
