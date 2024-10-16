import { FormId, RoleId } from 'types';

export type ActionId = string;

export type ActionSettings = {
  association: string;
  type: string;
  role: RoleId;
};

export type FormAction = {
  _id: ActionId;
  title: string;
  name: string;
  handler: Array<string>;
  method: Array<string>;
  condition?: any;
  priority: number;
  settings: ActionSettings;
  form: FormId;
  // Database timestamps
  deleted: Date | string;
};
