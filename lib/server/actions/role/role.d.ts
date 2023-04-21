/**
 * The settings form for this action.
 * @param {*} scope
 */
export function settingsForm(scope: any): Promise<({
    type: string;
    input: boolean;
    label: string;
    key: string;
    placeholder: string;
    template: string;
    dataSrc: string;
    data: {
        json: string;
    };
    valueProperty: string;
    multiple: boolean;
    validate: {
        required: boolean;
    };
} | {
    type: string;
    input: boolean;
    label: string;
    key: string;
    placeholder: string;
    template: string;
    dataSrc: string;
    data: {
        json: any[];
    };
    valueProperty: string;
    multiple: boolean;
    validate: {
        required: boolean;
    };
})[]>;
/**
 * Returns the action middleware.
 *
 * @param {*} scope
 */
export function executor(scope: any): Promise<(req: any, res: any, next: any) => Promise<any>>;
