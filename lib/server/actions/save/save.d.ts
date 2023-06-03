export namespace info {
    let name: string;
    let title: string;
    let description: string;
    let priority: number;
    namespace defaults {
        let handler: string[];
        let method: string[];
    }
    namespace access {
        let handler_1: boolean;
        export { handler_1 as handler };
        let method_1: boolean;
        export { method_1 as method };
    }
}
export function mappingComponents(scope: any): Promise<({
    type: string;
    key: string;
    label: string;
    persist: string;
    defaultValue: string;
    dataSrc: string;
    data: {
        values: {
            label: string;
            value: string;
        }[];
    };
    title?: undefined;
    customConditional?: undefined;
    components?: undefined;
} | {
    type: string;
    title: string;
    key: string;
    customConditional: string;
    components: {
        input: boolean;
        label: string;
        key: string;
        placeholder: string;
        rows: number;
        defaultValue: string;
        persistent: boolean;
        editor: string;
        type: string;
        description: string;
    }[];
    label?: undefined;
    persist?: undefined;
    defaultValue?: undefined;
    dataSrc?: undefined;
    data?: undefined;
})[]>;
/**
 * The settings form for this action.
 * @param {*} scope
 */
export function settingsForm(scope: any): Promise<({
    type: string;
    key: string;
    label: string;
    placeholder: string;
    valueProperty: string;
    dataSrc: string;
    data: {
        json: {
            label: any;
            value: string;
        }[];
    };
    required: boolean;
    customConditional?: undefined;
    legend?: undefined;
    components?: undefined;
    title?: undefined;
} | {
    type: string;
    key: string;
    label: string;
    placeholder: string;
    customConditional: string;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    required?: undefined;
    legend?: undefined;
    components?: undefined;
    title?: undefined;
} | {
    legend: string;
    key: string;
    type: string;
    label: string;
    customConditional: string;
    components: {
        label: string;
        key: string;
        type: string;
        hideLabel: boolean;
        components: {
            label: string;
            content: string;
            refreshOnChange: boolean;
            attrs: {
                attr: string;
                value: string;
            }[];
            key: string;
            type: string;
        }[];
    }[];
    placeholder?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    required?: undefined;
    title?: undefined;
} | {
    type: string;
    title: string;
    key: string;
    components: {
        input: boolean;
        label: string;
        key: string;
        placeholder: string;
        rows: number;
        defaultValue: string;
        persistent: boolean;
        editor: string;
        type: string;
        description: string;
    }[];
    label?: undefined;
    placeholder?: undefined;
    valueProperty?: undefined;
    dataSrc?: undefined;
    data?: undefined;
    required?: undefined;
    customConditional?: undefined;
    legend?: undefined;
})[]>;
export function saveToForm(scope: any, resource: any): undefined;
export function childSubmission(scope: any, req: any, res: any, submission: any): {
    data: {};
};
export function childResponse(scope: any, req: any, res: any): void;
export function executor(scope: any): Promise<(req: any, res: any, next: any) => Promise<any>>;
