import { Access, DataObject, FormId, ProjectId, RoleId } from 'types';

export type SubmissionId = string;

export interface Submission {
  _id: SubmissionId;
  _fvid: number;

  form: FormId;
  owner: SubmissionId;
  roles: Array<RoleId>;
  metadata: SubmissionMetadata;
  data: DataObject;
  project: ProjectId;
  state: SubmissionState;
  access: Access[];
  externalIds: Array<any>;
  externalTokens?: Array<any>;
  permission?: string;

  // Database timestamps
  created: Date | string;
  modified: Date | string;
  deleted?: Date | string;
}

export type SubmissionState = 'submitted';

export type SubmissionMetadata = {
  ssoteam?: boolean;
  memberCount?: number;
  selectData?: any;
  timezone: string;
  offset: number;
  origin: string;
  referrer: string;
  browserName: string;
  userAgent: string;
  pathName: string;
  onLine: boolean;
  headers?: Record<string, string>;
};
