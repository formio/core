import { ProjectId } from '@formio/types';
export type RoleId = string;
export type Role = {
    _id: RoleId;
    title: string;
    description: string;
    default: boolean;
    admin: boolean;
    project: ProjectId;
    machineName: string;
    created: Date | string;
    modified: Date | string;
    delted: Date | string;
};
