import { ConditionsScope, LogicContext, ProcessorContext } from 'types';
import {
  checkCustomConditional,
  checkJsonConditional,
  checkLegacyConditional,
  checkSimpleConditional,
  conditionallyHidden,
  isLegacyConditional,
} from './conditions';
import {
  LogicActionCustomAction,
  LogicActionMergeComponentSchema,
  LogicActionProperty,
  LogicActionPropertyBoolean,
  LogicActionPropertyString,
  LogicActionValue,
} from 'types/AdvancedLogic';
import { get, set, clone, isEqual, assign } from 'lodash';
import { evaluate, interpolate } from 'modules/jsonlogic';
import { registerEphermalState } from './utils';
import { getComponentAbsolutePath } from './formUtil';

export const hasLogic = (context: LogicContext): boolean => {
  const { component } = context;
  const { logic } = component;
  if (!logic || !logic.length) {
    return false;
  }
  return true;
};

export const checkTrigger = (context: LogicContext, trigger: any): boolean => {
  let shouldTrigger: boolean | null = false;
  switch (trigger.type) {
    case 'simple':
      if (isLegacyConditional(trigger.simple)) {
        shouldTrigger = checkLegacyConditional(
          trigger.simple,
          context as ProcessorContext<ConditionsScope>,
        );
      } else {
        shouldTrigger = checkSimpleConditional(
          trigger.simple,
          context as ProcessorContext<ConditionsScope>,
        );
      }
      break;
    case 'javascript':
      shouldTrigger = checkCustomConditional(
        trigger.javascript,
        context as ProcessorContext<ConditionsScope>,
        'result',
      );
      break;
    case 'json':
      shouldTrigger = checkJsonConditional(trigger, context as ProcessorContext<ConditionsScope>);
      break;
    default:
      shouldTrigger = false;
      break;
  }
  if (shouldTrigger === null) {
    return false;
  }
  return shouldTrigger;
};

export function setActionBooleanProperty(
  context: LogicContext,
  action: LogicActionPropertyBoolean,
): boolean {
  const { component, scope, path } = context;
  const absolutePath = getComponentAbsolutePath(component) || path;
  const property = action.property.value;
  const currentValue = get(component, property, false).toString();
  const newValue = action.state.toString();
  if (currentValue !== newValue) {
    set(component, property, newValue === 'true');

    // If this is "logic" forcing a component to set hidden property, then we will set the "conditionallyHidden"
    // flag which will trigger the clearOnHide functionality.
    if (property === 'hidden' && absolutePath) {
      if (!(scope as ConditionsScope).conditionals) {
        (scope as ConditionsScope).conditionals = [];
      }
      const conditionallyHidden = (scope as ConditionsScope).conditionals?.find((cond: any) => {
        return cond.path === absolutePath;
      });
      if (conditionallyHidden) {
        conditionallyHidden.conditionallyHidden = !!component.hidden;
        registerEphermalState(component, 'conditionallyHidden', !!component.hidden);
      } else {
        (scope as ConditionsScope).conditionals?.push({
          path: absolutePath,
          conditionallyHidden: !!component.hidden,
        });
      }
    }
    return true;
  }
  return false;
}

export function setActionStringProperty(
  context: LogicContext,
  action: LogicActionPropertyString,
): boolean {
  const { component } = context;
  const property = action.property.value;
  const textValue = action.property.component
    ? (action as any)[action.property.component]
    : action.text;
  const currentValue = get(component, property, '');
  const newValue = interpolate({ ...context, value: '' }, textValue, (evalContext: any) => {
    evalContext.value = currentValue;
  });
  if (newValue !== currentValue) {
    set(component, property, newValue);
    return true;
  }
  return false;
}

export function setActionProperty(context: LogicContext, action: LogicActionProperty): boolean {
  switch (action.property.type) {
    case 'boolean':
      return setActionBooleanProperty(context, action as LogicActionPropertyBoolean);
    case 'string':
      return setActionStringProperty(context, action as LogicActionPropertyString);
  }
  return false;
}

export function setValueProperty(context: LogicContext, action: LogicActionValue) {
  const { component, data, path } = context;
  const oldValue = get(data, path);
  const newValue = evaluate(context, action.value, 'value', (evalContext: any) => {
    evalContext.value = clone(oldValue);
  });
  if (
    !isEqual(oldValue, newValue) &&
    !(component.clearOnHide && conditionallyHidden(context as ProcessorContext<ConditionsScope>))
  ) {
    set(data, path, newValue);
    return true;
  }
  return false;
}

export function setMergeComponentSchema(
  context: LogicContext,
  action: LogicActionMergeComponentSchema,
) {
  const { component, data, path } = context;
  const oldValue = get(data, path);
  const schema = evaluate(
    { ...context, value: {} },
    action.schemaDefinition,
    'schema',
    (evalContext: any) => {
      evalContext.value = clone(oldValue);
    },
  );
  const merged = assign({}, component, schema);
  if (!isEqual(component, merged)) {
    assign(component, schema);
    return true;
  }
  return false;
}

export function setCustomAction(context: LogicContext, action: LogicActionCustomAction) {
  return setValueProperty(context, { type: 'value', value: action.customAction });
}

export const applyActions = (context: LogicContext): boolean => {
  const { component } = context;
  const { logic } = component;
  if (!logic || !logic.length) {
    return false;
  }
  return logic.reduce((changed, logicItem) => {
    const { actions, trigger } = logicItem;
    if (!trigger || !actions || !actions.length || !checkTrigger(context, trigger)) {
      return changed;
    }
    return actions.reduce((changed, action) => {
      switch (action.type) {
        case 'property':
          if (setActionProperty(context, action)) {
            return true;
          }
          return changed;
        case 'value':
          return setValueProperty(context, action) || changed;
        case 'mergeComponentSchema':
          if (setMergeComponentSchema(context, action)) {
            return true;
          }
          return changed;
        case 'customAction':
          return setCustomAction(context, action) || changed;
        default:
          return changed;
      }
    }, changed);
  }, false);
};
