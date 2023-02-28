import { FormId, RoleId } from '@formio/types';
export type ActionId = string;
export type ActionSettings = {
    association: string;
    type: string;
    role: RoleId;
};
export type Action = {
    _id: ActionId;
    title: string;
    name: string;
    handler: Array<string>;
    method: Array<string>;
    condition?: any;
    priority: number;
    settings: ActionSettings;
    form: FormId;
    deleted: Date | string;
};
