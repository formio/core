import { RoleId } from 'types/Role';

// TODO: Needs review about required & optional
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
