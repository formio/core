import { RulesLogic } from 'json-logic-js';
import { AdvancedLogic } from './AdvancedLogic';
import { getModelType } from 'utils/formUtil';
export type JSONConditional = { json: RulesLogic };
export type LegacyConditional = {
  show: boolean | string | null;
  when: string | null;
  eq: boolean | string;
};
export type SimpleConditionalConditions = { component: string; operator: string; value?: any }[];
export type SimpleConditional = {
  show: boolean | null;
  conjunction: string;
  conditions: SimpleConditionalConditions;
};

export type ComponentScope = {
  conditionallyHidden?: boolean;
  intentionallyHidden?: boolean;
};

export type BaseComponent = {
  input: boolean;
  type: string;
  key: string;
  path?: string; // The "form" path to the component including non-layout parent components.
  tableView?: boolean;
  placeholder?: string;
  prefix?: string;
  customClass?: string;
  mask?: boolean;
  suffix?: string;
  multiple?: boolean;
  protected?: boolean;
  unique?: boolean;
  persistent?: boolean | string;
  hidden?: boolean;
  scope?: ComponentScope;
  clearOnHide?: boolean;
  refreshOn?: string;
  redrawOn?: string;
  modalEdit?: boolean;
  label?: string;
  dataGridLabel?: boolean;
  labelPosition?: string;
  description?: string;
  errorLabel?: string;
  tooltip?: string;
  hideLabel?: boolean;
  widget?: { type: string } | string | null;
  tabindex?: string;
  disabled?: boolean;
  autofocus?: boolean;
  dbIndex?: boolean;
  defaultValue?: any;
  customDefaultValue?: string;
  calculateValue?: string;
  calculateServer?: boolean;
  attributes?: Record<string, string>;
  logic?: AdvancedLogic[];
  validateOn?: string;
  validateWhenHidden?: boolean;
  modelType?: ReturnType<typeof getModelType>;
  validate?: {
    required?: boolean;
    custom?: string;
    customPrivate?: boolean;
    customMessage?: string;
    strictDateValidation?: boolean;
    multiple?: boolean;
    unique?: boolean;
    // TODO: we should type this as RulesLogic from the JSONLogic lib but it's giving me too many problems
    json?: any;
    row?: string;
  };
  conditional?: JSONConditional | LegacyConditional | SimpleConditional;
  customConditional?: string;
  overlay?: {
    style: string;
    left: string;
    top: string;
    width: string;
    height: string;
  };
  allowCalculateOverride?: boolean;
  encrypted?: boolean;
  showCharCount?: boolean;
  showWordCount?: boolean;
  properties?: Record<string, string>;
  allowMultipleMasks?: boolean;
  addons?: any[]; // TODO: this should go away
  inputType?: string;
  conflictId?: string;
  errors?: Record<string, string>;
  truncateMultipleSpaces?: boolean;
};
