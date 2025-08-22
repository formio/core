import { ConditionsContext, JSONConditional, LegacyConditional, SimpleConditional } from 'types';
import { EvaluatorFn, evaluate, JSONLogicEvaluator } from 'modules/jsonlogic';
import {
  flattenComponents,
  getComponent,
  getComponentAbsolutePath,
  getComponentActualValue,
} from './formUtil';
import { has, isObject, map, every, some, find, filter, isBoolean, split } from 'lodash';
import ConditionOperators from './operators';

export const isJSONConditional = (conditional: any): conditional is JSONConditional => {
  return conditional && conditional.json && isObject(conditional.json);
};

export const isLegacyConditional = (conditional: any): conditional is LegacyConditional => {
  return conditional && conditional.when;
};

export const isSimpleConditional = (conditional: any): conditional is SimpleConditional => {
  return conditional && conditional.conjunction && conditional.conditions;
};

export function conditionallyHidden(context: ConditionsContext) {
  const { scope, path, component } = context;
  const absolutePath = getComponentAbsolutePath(component) || path;
  if (scope.conditionals && absolutePath) {
    const hidden = find(scope.conditionals, (conditional) => {
      return conditional.path === absolutePath;
    });
    return hidden?.conditionallyHidden;
  }
  return false;
}

/**
 * Check custom javascript conditional.
 *
 * @param component
 * @param custom
 * @param row
 * @param data
 * @returns {*}
 */
export function checkCustomConditional(
  condition: string,
  context: ConditionsContext,
  variable: string = 'show',
): boolean | null {
  const { evalContext } = context;
  if (!condition) {
    return null;
  }
  const value = evaluate(context, condition, variable, evalContext as EvaluatorFn);
  // For reverse compatability... if "show" is never set, then it should be shown. This
  // comes from the following legacy behavior
  // https://github.com/formio/formio.js/blob/973b214ec6bf23d8679d0f5007b3522528abd36d/src/utils/utils.js#L311C33-L311C37
  if (value === undefined) {
    return true;
  }
  if (value === null) {
    return null;
  }
  return value;
}

/**
 * Checks the legacy conditionals.
 *
 * @param conditional
 * @param context
 * @param checkDefault
 * @returns
 */
export function checkLegacyConditional(
  conditional: LegacyConditional,
  context: ConditionsContext,
): boolean | null {
  const { row, data, component } = context;
  if (!conditional || !isLegacyConditional(conditional) || !conditional.when) {
    return null;
  }
  const value: any = getComponentActualValue(component, conditional.when, data, row);
  const eq = String(conditional.eq);
  const show = String(conditional.show);
  if (isObject(value) && has(value, eq)) {
    return String((value as Record<string, string>)[eq]) === show;
  }
  if (Array.isArray(value) && value.map(String).includes(eq)) {
    return show === 'true';
  }
  return (String(value) === eq) === (show === 'true');
}

/**
 * Checks the JSON Conditionals.
 * @param conditional
 * @param context
 * @returns
 */
export function checkJsonConditional(
  conditional: JSONConditional,
  context: ConditionsContext,
): boolean | null {
  const { evalContext } = context;
  if (!conditional || !isJSONConditional(conditional)) {
    return null;
  }
  const evalContextValue = evalContext ? evalContext(context) : context;
  return JSONLogicEvaluator.evaluate(conditional.json, evalContextValue);
}

/**
 * Checks if condition can potentially have a value path instead of component path.
 * @param condition
 * @returns {boolean}
 */
function isConditionPotentiallyBasedOnValuePath(condition: any = {}) {
  let comparedValue;
  try {
    comparedValue = JSON.parse(condition.value);
  } catch (ignoreError) {
    comparedValue = condition.value;
  }
  return (
    isBoolean(comparedValue) &&
    (condition.component || '').split('.').length > 1 &&
    condition.operator === 'isEqual'
  );
}

/**
 * Checks the simple conditionals.
 * @param conditional
 * @param context
 * @returns
 */
export function checkSimpleConditional(
  conditional: SimpleConditional,
  context: ConditionsContext,
): boolean | null {
  const { component, data, row, instance, form } = context;
  if (!conditional || !isSimpleConditional(conditional)) {
    return null;
  }
  const { conditions = [], conjunction = 'all', show = true } = conditional;
  if (!conditions.length) {
    return null;
  }

  const conditionsResult = filter(
    map(conditions, (cond) => {
      let { value: comparedValue, component: conditionComponentPath } = cond;
      const { operator } = cond;
      if (!conditionComponentPath) {
        // Ignore conditions if there is no component path.
        return null;
      }
      const formComponents = form?.components || [];
      let conditionComponent = getComponent(formComponents, conditionComponentPath, true);
      // If condition componenet is not found, check if conditionComponentPath is value path.
      // Need to handle condtions like:
      //   {
      //     "component": "selectBoxes.a",
      //     "operator": "isEqual",
      //     "value": "true"
      //   }
      if (
        !conditionComponent &&
        isConditionPotentiallyBasedOnValuePath(cond) &&
        formComponents.length
      ) {
        const flattenedComponents = flattenComponents(formComponents, true);
        const pathParts = split(conditionComponentPath, '.');
        const valuePathParts = [];

        while (!conditionComponent && pathParts.length) {
          conditionComponent = flattenedComponents[`${pathParts.join('.')}`];
          if (!conditionComponent) {
            valuePathParts.unshift(pathParts.pop());
          }
        }
        if (
          conditionComponent &&
          conditionComponent.type === 'selectboxes' &&
          valuePathParts.length
        ) {
          console.warn(
            'Condition based on selectboxes has wrong format. Resave the form in the form builder to fix it.',
          );
          conditionComponentPath = pathParts.join('.');
          comparedValue = valuePathParts.join('.');
        }
      }

      const value = conditionComponent
        ? getComponentActualValue(conditionComponent, conditionComponentPath, data, row)
        : null;

      const ConditionOperator = ConditionOperators[operator];
      return ConditionOperator
        ? new ConditionOperator().getResult({
            value,
            comparedValue,
            instance,
            component,
            conditionComponent,
            conditionComponentPath,
            data,
          })
        : true;
    }),
    (res) => res !== null,
  );

  let result = false;
  switch (conjunction) {
    case 'any':
      result = some(conditionsResult, (res) => !!res);
      break;
    default:
      result = every(conditionsResult, (res) => !!res);
  }
  return show ? result : !result;
}
