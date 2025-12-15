import { RoleId } from 'types/Role';
export type Access = {
  type: AccessType;
  roles: RoleId[];
  resources?: string[];
};
export type BasicAccessType = 'read' | 'write' | 'create' | 'admin';
export type AccessType =
  | 'self'
  | 'create_own'
  | 'create_all'
  | 'read_own'
  | 'read_all'
  | 'update_own'
  | 'update_all'
  | 'delete_own'
  | 'delete_all'
  | 'team_read'
  | 'team_write'
  | 'team_admin'
  | 'team_access';
