import { Component, PassedComponentInstance } from 'types';
import { Formio } from '../sdk/Formio';

type HookError = Error | Error[] | { message: string } | { message: string }[];
/**
 * The Formio class options interface.
 */
export interface FormioOptions {
  /**
   * The base API url of the Form.io Platform. Example: https://api.form.io
   */
  base?: string;

  /**
   * The project API url of the Form.io Project. Example: https://examples.form.io
   */
  project?: string;

  useSessionToken?: boolean;
  readOnly?: boolean;
  noDefaults?: boolean;
  language?: string;
  i18n?: { [key: string]: string; };
  viewAsHtml?: boolean;
  renderMode?: 'form' | 'html' | 'flat' | 'builder' | 'pdf';
  hightlightErrors?: boolean;
  componentErrorClass?: string;
  template?: string;
  // TODO: type this better
  templates?: any;
  iconset?: string;
  components?: { [key: string]: JSON };
  disabled?: { [key: string]: boolean };
  showHiddenFields?: boolean;
  hide?: { [key: string]: boolean };
  show?: { [key: string]: boolean };
  formio?: Formio;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  hooks?: {
    beforeSubmit?: (submission: JSON, next: (err?: HookError) => void) => void;
    beforeNext?: (currentPage: JSON, submission: JSON, next: (err?: HookError) => void) => void;
    beforePrev?: (currentPage: JSON, submission: JSON, next: (err?: HookError) => void) => void;
    customValidation?: (submission: JSON, next: (err?: HookError) => void) => void;
    attachWebform?: (element: HTMLElement, instance: any) => HTMLElement;
    beforeCancel?: () => boolean;
    attachComponent?: (element: HTMLElement, instance: any) => HTMLElement;
    setDataValue?: (value: any, key: string, data: JSON) => any;
    addComponents?: (components: Component[], instance: any) => Component[];
    addComponent?: (component: Component, data: JSON, before: HTMLElement) => Component;
    attachComponents?: (element: HTMLElement, components: (PassedComponentInstance & {component: Component})[], container: Component[], instance: any) => HTMLElement;
  };
  alwaysDirty?: boolean;
  saveDraft?: boolean;
  saveDraftThrottle?: number;
  skipDraftRestore?: boolean;
  display?: 'form' | 'wizard' | 'pdf';
  cdnUrl?: string;
  flatten?: boolean;
  sanitize?: boolean;
  noAlerts?: boolean;
  sanitizeConfig?: {
    addAttr?: string[];
    addTags?: string[];
    allowedAttrs?: string[];
    allowedTags?: string[];
    allowedUriRegex?: string[];
    addUriSafeAttr?: string[];
  }
  buttonSettings?: {
    showCancel?: boolean;
    showPrevious?: boolean;
    showNext?: boolean;
    showSubmit?: boolean;
  };
  breadCrumbSettings?: { clickable: boolean };
  allowPrevious?: boolean;
  wizardButtonOrder?: string[];
  showCheckboxBackground?: boolean;
  zoom?: number;
}

/**
 * The different path types for a project.
 */
export enum FormioPathType {
  Subdirectories = 'Subdirectories',
  Subdomains = 'Subdomains'
}
