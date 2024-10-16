import * as flatpickrTypes from 'flatpickr';
import { BaseComponent } from './BaseComponent';

export type Component =
  | TextFieldComponent
  | NestedComponent
  | ContainerComponent
  | AddressComponent
  | ButtonComponent
  | CheckboxComponent
  | ColumnsComponent
  | TableComponent
  | ContentComponent
  | NumberComponent
  | NestedArrayComponent
  | DataGridComponent
  | DataMapComponent
  | DataSourceComponent
  | DateTimeComponent
  | DayComponent
  | EditGridComponent
  | EmailComponent
  | FieldSetComponent
  | FileComponent
  | FormComponent
  | HiddenComponent
  | HtmlComponent
  | PanelComponent
  | PasswordComponent
  | PhoneNumberComponent
  | ListComponent
  | RadioComponent
  | RecaptchaComponent
  | SelectComponent
  | ResourceComponent
  | SelectBoxesComponent
  | SignatureComponent
  | SurveyComponent
  | TabsComponent
  | TagsComponent
  | TextAreaComponent
  | TimeComponent
  | UrlComponent
  | WellComponent;

export type CalendarPickerOptions = flatpickrTypes.default.Options.Options;
export type BootstrapSizing = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type TextFieldComponent = BaseComponent & {
  widget?:
    | { type: 'input' }
    | (CalendarPickerOptions & {
        enableDate?: boolean;
        format?: string;
        saveAs?: string;
        displayInTimezone?: string;
        useLocaleSettings?: boolean;
      })
    | null;
  inputType?: string;
  inputFormat?: string;
  inputMask?: string;
  inputMasks?: { label: string; mask: string }[];
  isMultipleMasksField?: boolean;
  displayMask?: string;
  spellcheck?: boolean;
  truncateMultipleSpaces?: boolean;
  validate?: {
    minLength?: number | string;
    maxLength?: number | string;
    minWords?: number | string;
    maxWords?: number | string;
    pattern?: string;
    patternMessage?: string;
    skipMaskValidation?: boolean;
  };
};

export type NestedComponent = BaseComponent & {
  tree: boolean;
  lazyLoad: boolean;
};

export type ContainerComponent = NestedComponent & {
  clearOnHide: boolean;
  tree: boolean;
  hideLabel: boolean;
  components: Component[];
};

export type HasChildComponents = BaseComponent & {
  components: Component[];
  path: string;
};

export type HasRows = BaseComponent & {
  path: string;
  rows: {
    components: Component[];
  }[][];
};

export type HasColumns = BaseComponent & {
  path: string;
  columns: {
    components: Component[];
  }[];
};

export type AddressComponent = ContainerComponent & {
  switchToManualModeLabel: string;
  provider: string;
  providerOptions: Record<string, string>;
  manualModeViewString: string;
  disableClearIcon: boolean;
  enableManualMode: boolean;
};

export type ButtonComponent = BaseComponent & {
  size: BootstrapSizing;
  leftIcon: string;
  rightIcon: string;
  block: boolean;
  action: string;
  disableOnInvalid: boolean;
  theme: string;
};

export type CheckboxComponent = BaseComponent & {
  value: string;
  name: string;
};

export type ColumnsComponent = NestedComponent & {
  columns: {
    components: Component[];
    width: number;
    offset: number;
    push: number;
    pull: number;
    size: BootstrapSizing;
  }[];
  autoAdjust: boolean;
};

export type TableComponent = NestedComponent & {
  rows: Component[][];
  numRows: number;
  numCols: number;
  header: [];
  caption: string;
  cloneRows: boolean;
  striped: boolean;
  bordered: boolean;
  hover: boolean;
  condensed: boolean;
};

export type ContentComponent = BaseComponent & {
  html: string;
};

export type NumberComponent = BaseComponent & {
  validate?: {
    min?: number | string;
    max?: number | string;
    step?: 'any';
  };
  delimiter?: boolean;
  requireDecimal?: boolean;
  inputFormat?: string;
  truncateMultipleSpaces?: boolean;
};

export type NestedArrayComponent = NestedComponent & {
  disableAddingRemovingRows: boolean;
  components: Component[];
};

export type DataGridComponent = NestedArrayComponent;

export type DataMapComponent = DataGridComponent & {
  addAnother: string;
  disableAddingRemovingRows: boolean;
  keyBeforeValue: boolean;
  valueComponent: BaseComponent;
};

export type DataSourceComponent = BaseComponent & {
  fetch?: {
    url: string;
    method: string;
    headers: { key: string; value: string }[];
    authenticate: boolean;
    forwardHeaders: boolean;
    specifyBody: string;
    mapFunction: string;
  };
};

export type DataTableComponent = EditGridComponent & {
  fetch?: {
    enableFetch: boolean;
    dataSrc: 'resource' | 'url';
    sort?: { defaultQuery?: string };
    resource?: string;
    headers?: { key: string; value: string }[];
    components?: { key: string; path: string }[] | Component[];
  };
};

export type DateTimeComponent = BaseComponent & {
  format?: string;
  useLocaleSettings?: boolean;
  allowInput?: boolean;
  enableDate?: boolean;
  enableTime?: boolean;
  defaultDate?: string;
  displayInTimezone?: string;
  timezone?: string;
  datepickerMode?: string;
  enableMinDateInput?: boolean;
  enableMaxDateInput?: boolean;
  datePicker: {
    showWeeks?: boolean;
    startingDay?: number;
    initDate?: string;
    minMode?: string;
    maxMode?: string;
    yearRows?: number;
    yearColumns?: number;
    minDate?: string | null;
    maxDate?: string | null;
    disableWeekends?: boolean;
    disableWeekdays?: boolean;
  };
  timePicker?: {
    hourStep?: number;
    minuteStep?: number;
    showMeridian?: boolean;
    readonlyInput?: boolean;
    mousewheel?: boolean;
    arrowkeys?: boolean;
  };
  widget: CalendarPickerOptions & {
    displayInTimezone?: string;
    useLocaleSettings?: boolean;
    format?: string;
    disableWeekends?: boolean;
    disableWeekdays?: boolean;
  };
  customOptions?: CalendarPickerOptions;
};

export type DayComponent = BaseComponent & {
  fields: {
    day: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      hide?: boolean;
    };
    month: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      hide: boolean;
    };
    year: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      hide?: boolean;
      maxYear?: string | number;
      minYear?: string | number;
    };
  };
  hideInputLabels?: boolean;
  inputsLabelPosition?: string;
  useLocaleSettings?: boolean;
  dayFirst?: boolean;
  maxDate?: string;
  minDate?: string;
  maxYear?: string | number;
  minYear?: string | number;
  defaultValue?: string;
};

export type EditGridComponent = NestedArrayComponent & {
  removeRow: string;
  defaultOpen: boolean;
  openWhenEmpty: boolean;
  modal: boolean;
  components: Component[];
  inlineEdit: boolean;
  templates: {
    header: string;
    row: string;
    tableHeader: string;
    tableRow: string;
    footer: string;
  };
};

export type EmailComponent = TextFieldComponent & {
  kickbox?: {
    enabled?: boolean;
  };
};

export type FieldSetComponent = NestedComponent & { components: Component[] };

export type FileComponent = BaseComponent & {
  image?: boolean;
  privateDownload?: boolean;
  imageSize?: string;
  filePattern?: string;
  fileMinSize?: string;
  fileMaxSize?: string;
  uploadOnly?: boolean;
};

export type FormComponent = BaseComponent & {
  src: string;
  reference: boolean;
  form: string;
  path: string;
};

export type HiddenComponent = BaseComponent;

export type HtmlComponent = BaseComponent & {
  tag: string;
  attrs: Record<string, string>[];
  content: string;
};

export type PanelComponent = NestedComponent & {
  theme: string;
  breadcrumb: string;
};

export type PasswordComponent = TextFieldComponent;

export type PhoneNumberComponent = NumberComponent & { inputMode: 'decimal' };

export type ListComponent = BaseComponent & {
  values?: { label: string; value: string; shortcut?: string }[];
  dataSrc?: string;
  authenticate?: boolean;
  ignoreCache?: boolean;
  template?: string;
  dataType?: 'auto' | 'boolean' | 'string' | 'object' | 'number';
  validate?: {
    onlyAvailableItems?: boolean;
  };
  valueProperty?: string;
};

type StaticValuesRadioComponent = ListComponent & {
  values: { label: string; value: string; shortcut?: string }[];
  dataSrc?: 'values';
  fieldSet?: boolean;
  optionsLabelPosition?: string;
  inline?: boolean;
};

type UrlValuesRadioComponent = ListComponent & {
  data: {
    url: string;
    headers: {
      key: string;
      value: string;
    }[];
  };
  dataSrc: 'url';
  fieldSet?: boolean;
  optionsLabelPosition?: string;
  inline?: boolean;
};

export type RadioComponent = StaticValuesRadioComponent | UrlValuesRadioComponent;

export type RecaptchaComponent = BaseComponent;

type StaticValuesSelectData = {
  data: {
    values: { label: string; value: string }[];
  };
  dataSrc?: undefined | 'values';
};

type JsonValuesSelectData = {
  data: {
    json: unknown[] | string;
  };
  dataSrc: 'json';
};

type ResourceValueSelectData = {
  data: {
    resource: string;
  };
  dataSrc: 'resource';
};

type CustomValuesSelectData = {
  data: {
    custom: string;
  };
  dataSrc: 'custom';
};

type UrlValuesSelectData = {
  data: {
    url: string;
    headers: {
      key: string;
      value: string;
    }[];
  };
  dataSrc: 'url';
};

export type SelectComponentOptions = ListComponent & {
  idPath?: string;
  validate?: {
    select?: boolean;
  };
  clearOnRefresh?: boolean;
  limit?: number;
  valueProperty?: string;
  lazyLoad?: boolean;
  filter?: string;
  searchEnabled?: boolean;
  searchDebounce?: number;
  searchField?: string;
  minSearch?: number;
  readOnlyValue?: boolean;
  selectFields?: string;
  sort?: string;
  selectThreshold?: number;
  uniqueOptions?: boolean;
  fuseOptions?: {
    include?: string;
    threshold?: number;
  };
  indexeddb?: {
    filter?: Record<string, any>; // TODO: not sure if this is correct
  };
  customOptions?: Record<string, string>; // TODO: with flatpickr I type these, should I do the same with ChoicesJS?
  useExactSearch?: boolean;
  disableLimit?: boolean;
};

export type SelectComponent = (
  | JsonValuesSelectData
  | StaticValuesSelectData
  | CustomValuesSelectData
  | ResourceValueSelectData
  | UrlValuesSelectData
) &
  SelectComponentOptions;

export type ResourceComponent = SelectComponent & {
  resource: string;
  project: string;
};

export type SelectBoxesComponent = RadioComponent & {
  inline?: boolean;
  optionsLabelPosition?: string;
  defaultValue?: Record<string, boolean>;
  validate?: {
    minSelectedCount?: number | string;
    maxSelectedCount?: number | string;
  };
  minSelectedCountMessage?: string;
  maxSelectedCountMessage?: string;
};

export type SignatureComponent = BaseComponent & {
  footer: string;
  width: string;
  height: string;
  penColor: string;
  backgroundColor: string;
  minWidth: string;
  maxWidth: string;
  keepOverlayRatio: boolean;
};

export type SurveyComponent = BaseComponent & {
  questions: {
    label: string;
    value: string;
    tooltip: string;
  }[];
  values: {
    label: string;
    value: string;
    tooltip: string;
  }[];
};

export type TabsComponent = NestedComponent & {
  components: {
    label: string;
    key: string;
    components: Component[];
  }[];
  verticalLayout: boolean;
};

export type TagsComponent = BaseComponent & {
  delimeter: string;
  storeas: string;
  maxTags: number;
};

export type TextAreaComponent = TextFieldComponent & {
  rows: number;
  wysiwyg: boolean;
  editor: string;
  fixedSize: boolean;
  inputFormat: string;
  as?: string;
};

export type TimeComponent = TextFieldComponent & {
  format?: string;
  dataFormat: string;
};

export type TreeComponent = NestedComponent & {
  multiple: boolean;
  components: Component[];
};

export type UrlComponent = TextFieldComponent;

export type WellComponent = NestedComponent & {
  components: Component[];
};

export * from './BaseComponent';
