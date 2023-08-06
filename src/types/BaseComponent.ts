import { RulesLogic } from 'json-logic-js';

export type BaseComponent = {
    input: boolean;
    type: string;
    key: string;
    tableView: boolean;
    placeholder?: string;
    prefix?: string;
    customClass?: string;
    mask?: boolean;
    suffix?: string;
    multiple?: boolean;
    protected?: boolean;
    unique?: boolean;
    persistent?: boolean | 'client-only';
    hidden?: boolean;
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
    customDefaultValue?: string;
    calculateValue?: string;
    calculateServer?: boolean;
    attributes?: Record<string, string>;
    validateOn?: string;
    validate?: {
        required?: boolean;
        custom?: string;
        customPrivate?: boolean;
        customMessage?: string;
        strictDateValidation?: boolean;
        multiple?: boolean;
        unique?: boolean;
        // TODO: we should type this as RulesLogic but it's giving me too many problems
        json?: any;
    };
    conditional?: { show: boolean | null; when: string | null; eq: string };
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
    inputType?: any;
    errors?: Record<string, string>;
    truncateMultipleSpaces?: boolean;
};
