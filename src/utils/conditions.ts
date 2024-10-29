// @ts-nocheck
import { ConditionsContext, JSONConditional, LegacyConditional, SimpleConditional } from 'types';
import { EvaluatorFn, evaluate, JSONLogicEvaluator } from 'modules/jsonlogic';
import { flattenComponents, getComponent, getComponentActualValue } from './formUtil';
import { has, isObject, map, every, some, find, filter, isBoolean, split } from 'lodash';
import ConditionOperators from './operators';
import _ from 'lodash';

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
  const { evalContext } = context;
  if (!condition) {
    return null;
  }
  const value = evaluate(context, condition, variable, evalContext as EvaluatorFn);
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

function getConditionalPathsRecursive(conditionPaths: any, data: any): any {
  let currentGlobalIndex = 0;
  const conditionalPathsArray: string[] = [];

  const getConditionalPaths = (data: any, currentPath = '', localIndex = 0) => {
    currentPath = currentPath.replace(/^\.+|\.+$/g, '');
    const currentLocalIndex = localIndex;
    const currentData = _.get(data, currentPath);

    if (Array.isArray(currentData) && currentData.filter(Boolean).length > 0) {
      if (currentData.some(element => typeof element !== 'object')) {
        return;
      }

      const hasInnerDataArray = currentData.find(x => Array.isArray(x[conditionPaths[currentLocalIndex]]));

      if (hasInnerDataArray) {
        currentData.forEach((_, indexOutside) => {
          const innerCompDataPath = `${currentPath}[${indexOutside}].${conditionPaths[currentLocalIndex]}`;
          getConditionalPaths(data, innerCompDataPath, currentLocalIndex + 1);
        });
      }
      else {
        currentData.forEach((x, index) => {
          if (!_.isNil(x[conditionPaths[currentLocalIndex]])) {
            const compDataPath = `${currentPath}[${index}].${conditionPaths[currentLocalIndex]}`;
            conditionalPathsArray.push(compDataPath);
          }
        });
      }
    }
    else {
      if (!conditionPaths[currentGlobalIndex]) {
        return;
      }
      currentGlobalIndex = currentGlobalIndex + 1;
      getConditionalPaths(data, `${currentPath}.${conditionPaths[currentGlobalIndex - 1]}`, currentGlobalIndex);
    }
  };

  getConditionalPaths(data);

  return conditionalPathsArray;
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

  console.log("EVGEN")
  const { component, data, row, instance, form } = context;
  if (!conditional || !isSimpleConditional(conditional)) {
    return null;
  }
  // @ts-ignore
  if (conditional.when) {
    // // @ts-ignore
    // const value = getComponentActualValue(conditional!.when, data, row);
    // // @ts-ignore
    // const eq = String(conditional.eq);
    // const show = String(conditional.show);

    // // Special check for selectboxes component.
    // // @ts-ignore
    // if (_.isObject(value) && _.has(value, conditional.eq)) {
    //   // @ts-ignore
    //   return String(value[conditional.eq]) === show;
    // }
    // // FOR-179 - Check for multiple values.
    // if (Array.isArray(value) && value.map(String).includes(eq)) {
    //   return show === 'true';
    // }

    // return (String(value) === eq) === (show === 'true');
  }
  else {
    const { conditions = [], conjunction = 'all', show = true } = conditional;
    if (!conditions.length) {
      return null;
    }

    const conditionsResult = filter(
      map(conditions, (cond) => {
        const { operator } = cond;
        let { value: comparedValue, component: conditionComponentPath } = cond;
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

        const splittedConditionPath = conditionComponentPath.split('.');
        // @ts-ignore
        const conditionalPaths = (component?.parent?.type || instance?.parent?.type) === 'datagrid' || (component?.parent?.type || instance?.parent?.type) === 'editgrid' ? [] : getConditionalPathsRecursive(splittedConditionPath, data);

        if(conditionComponent?.component?.type === "checkbox") {
          if(typeof comparedValue === 'string') {
            comparedValue = comparedValue === 'true'? true: false  //!!!! replace just on:  compared = compared === 'value'
          }
        }
        if (conditionalPaths.length > 0) {
          return conditionalPaths.map((path: string) => {
            const value = getComponentActualValue(conditionComponent, path, data, row);

            const ConditionOperator = ConditionOperators[operator];
            return ConditionOperator
              ? new ConditionOperator().getResult({ value, comparedValue, instance, component, conditionComponentPath })
              : true;
          });
        }

        else {

          const value = getComponentActualValue(conditionComponent, conditionComponentPath, data, row);
          const СonditionOperator = ConditionOperators[operator];
          return СonditionOperator
            ? new СonditionOperator().getResult({ value, comparedValue, instance, component, conditionComponentPath, conditionComponent })
            : true;

        }
      }),
      (res) => res !== null,
    );

    let result = false;
    switch (conjunction) {
      case 'any':
        result = some(conditionsResult.flat(), (res) => !!res);
        break;
      default:
        result = every(conditionsResult.flat(), (res) => !!res);
    }
    return show ? result : !result;
  }
}