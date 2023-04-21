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
    dataSrc: string;
    valueProperty: string;
    data: {
        json: any[];
    };
    multiple: boolean;
    validate: {
        required: boolean;
    };
    description?: undefined;
    defaultValue?: undefined;
    suffix?: undefined;
} | {
    type: string;
    label: string;
    key: string;
    placeholder: string;
    dataSrc: string;
    valueProperty: string;
    data: {
        json: any[];
    };
    multiple: boolean;
    validate: {
        required: boolean;
    };
    input?: undefined;
    description?: undefined;
    defaultValue?: undefined;
    suffix?: undefined;
} | {
    type: string;
    key: string;
    input: boolean;
    label: string;
    description: string;
    defaultValue: string;
    placeholder?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    multiple?: undefined;
    validate?: undefined;
    suffix?: undefined;
} | {
    type: string;
    key: string;
    input: boolean;
    label: string;
    description: string;
    defaultValue: string;
    suffix: string;
    placeholder?: undefined;
    dataSrc?: undefined;
    valueProperty?: undefined;
    data?: undefined;
    multiple?: undefined;
    validate?: undefined;
})[]>;
/**
 * Format a string to show how long one must wait.
 *
 * @param time - In seconds.
 * @returns {string}
 */
export function waitText(time: any): string;
/**
 * Checks the login attempts for a certain login.
 *
 * @param user
 * @param next
 * @returns {*}
 */
export function checkAttempts(scope: any, error: any, user: any): any;
/**
 * Returns the action middleware.
 *
 * @param {*} scope
 */
export function executor(scope: any): Promise<(req: any, res: any, next: any) => Promise<any>>;
