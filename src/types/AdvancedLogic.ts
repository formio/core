import { RulesLogic } from 'json-logic-js';
import { SimpleConditional } from './BaseComponent';

export type LogicTriggerSimple = {
  type: 'simple';
  simple: SimpleConditional;
};

export type LogicTriggerJavascript = {
  type: 'javascript';
  javascript: string;
};

export type LogicTriggerJson = {
  type: 'json';
  json: RulesLogic;
};

export type LogicTriggerEvent = {
  type: 'event';
  event: string;
};

export type LogicTrigger =
  | LogicTriggerSimple
  | LogicTriggerJavascript
  | LogicTriggerJson
  | LogicTriggerEvent;

export type LogicActionPropertyBoolean = {
  type: 'property';
  property: {
    type: 'boolean';
    value: string;
  };
  state: boolean | 'true' | 'false';
};

export type LogicActionPropertyString = {
  type: 'property';
  property: {
    type: string;
    component: string;
    value: string;
  };
  text: string;
};

export type LogicActionProperty = LogicActionPropertyBoolean | LogicActionPropertyString;

export type LogicActionValue = {
  type: 'value';
  value: string;
};

export type LogicActionMergeComponentSchema = {
  type: 'mergeComponentSchema';
  schemaDefinition: any;
};

export type LogicActionCustomAction = {
  type: 'customAction';
  customAction: string;
};

export type LogicAction =
  | LogicActionProperty
  | LogicActionValue
  | LogicActionMergeComponentSchema
  | LogicActionCustomAction;

export type AdvancedLogic = {
  trigger: LogicTrigger;
  actions: LogicAction[];
};
