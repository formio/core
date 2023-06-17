import {
    DateTimeComponent,
    DayComponent,
    NumberComponent,
    RadioComponent,
    SelectBoxesComponent,
    SelectComponentOptions,
    TextFieldComponent,
} from '../../src/types/Component';
export declare const simpleTextField: TextFieldComponent;
export declare const simpleDateTimeField: DateTimeComponent;
export declare const simpleDayField: DayComponent;
export declare const calendarTextField: TextFieldComponent;
export declare const simpleEmailField: {
    label: string;
    tableView: boolean;
    key: string;
    type: string;
    input: boolean;
};
export declare const simpleSelectBoxes: SelectBoxesComponent;
export declare const simpleNumberField: NumberComponent;
export declare const simpleUrlField: {
    label: string;
    tableView: boolean;
    key: string;
    type: string;
    input: boolean;
};
export declare const simpleSelectOptions: SelectComponentOptions;
export declare const simpleRadioField: RadioComponent;
