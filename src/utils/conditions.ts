import { has, isObject, map, every, some, find, filter, isString } from 'lodash';
import { getComponent, getComponentValue } from './formUtil';
import ConditionOperators from './operators';
import { evaluate } from './utils';
import { ConditionsContext, JSONConditional, LegacyConditional, SimpleConditional } from 'types';

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
  const { scope, path } = context;
  if (scope.conditionals && path) {
    const hidden = find(scope.conditionals, (conditional) => {
      return conditional.path === path;
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
  if (!condition) {
    return null;
  }
  const value = evaluate(condition, context, variable);
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
  const { data, form, paths, local } = context;
  if (!conditional || !isLegacyConditional(conditional) || !conditional.when) {
    return null;
  }
  const value: any = getComponentValue(form, data, conditional.when, paths?.dataIndex, local);
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
  if (!conditional || !isJSONConditional(conditional)) {
    return null;
  }
  return evaluate(conditional.json as string, context);
}

/**
 * Convert the 'show' property of simple conditional to boolean
 * @param show
 * @returns {boolean}
 */
export function convertShowToBoolean(show: any) {
  let shouldShow = show;
  if (isString(show)) {
    try {
      shouldShow = JSON.parse(show);
    } catch (e) {
      console.log(e);
      shouldShow = show;
    }
  }

  return !!shouldShow;
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
  const { component, data, instance, form, paths, local } = context;
  if (!conditional || !isSimpleConditional(conditional)) {
    return null;
  }
  const { conditions = [], conjunction = 'all', show = true } = conditional;
  if (!conditions.length) {
    return null;
  }

  const conditionsResult = filter(
    map(conditions, (cond) => {
      const { operator } = cond;
      const { value: comparedValue, component: conditionComponentPath } = cond;
      if (!conditionComponentPath) {
        // Ignore conditions if there is no component path.
        return null;
      }
      const formComponents = form?.components || [];
      const conditionComponent = getComponent(
        formComponents,
        conditionComponentPath,
        true,
        paths?.dataIndex,
      );
      const value = conditionComponent
        ? getComponentValue(form, data, conditionComponentPath, paths?.dataIndex, local)
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
  return convertShowToBoolean(show) ? result : !result;
}
