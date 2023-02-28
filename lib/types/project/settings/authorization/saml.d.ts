import { RoleId } from '@formio/types/Role';
export type ProjectSamlConfig = {
    idp: string;
    issuer: string;
    callbackUrl: string;
    passport: string;
    query: string;
    emailPath: string;
    rolesPath: string;
    rolesDelimiter: string;
    profileFields: string;
    roles: Array<{
        formIoRole: string;
        id: RoleId;
        role: string;
        samlRole: string;
    }>;
};
