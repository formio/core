import { Access, SubmissionId } from 'types';
import { ProjectSettings } from 'types/project/settings';

export type ProjectId = string;

export type Project = {
  _id: ProjectId;
  title: string;
  name: string;
  type?: ProjectType;
  description?: string;
  tag?: string;
  owner: SubmissionId;
  project?: string;
  remote?: any;
  plan: ProjectPlan;
  billing?: ProjectBilling;
  apiCalls?: ProjectApiCalls;
  steps: Array<string>;
  framework: ProjectFramework;
  primary: boolean;
  access: Access[];
  trial?: Date | string;
  lastDeploy?: Date | string;
  stageTitle: string;
  machineName: string;
  config?: Record<string, string>;
  protect: boolean;
  settings?: ProjectSettings;
  remoteSecret?: string;
  builderConfig?: any;
  formDefaults: {
    revisions?: 'current' | 'original';
  };
  public?: {
    custom?: {
      css?: string;
      js?: string;
    };
    formModule?: string;
  };

  // Database timestamps
  created: Date | string;
  modified: Date | string;
  deleted: Date | string;
};

export type ProjectRef = {
  _id?: ProjectId;
  name?: string;
};

export type ProjectType = 'project' | 'stage' | 'tenant';

export type ProjectPlan = 'basic' | 'independent' | 'team' | 'trial' | 'commercial';

export type ProjectFramework =
  | 'angular'
  | 'angular2'
  | 'react'
  | 'vue'
  | 'html5'
  | 'simple'
  | 'custom'
  | 'aurelia'
  | 'javascript';

export type ProjectUsage = {
  projects?: number;
  tenants?: number;
  stages?: number;
  livestages?: number;
  forms?: number;
  emails?: number;
  submissionRequests?: number;
  formRequests?: number;
  pdfs?: number;
  pdfDownloads?: number;
  remoteStages?: number;
  apiServers?: number;
  pdfServers?: number;
  formManagers?: number;
  vpats?: number;
  submissionServers?: number;
  plan?: ProjectPlan;
  startDate?: string;
  options?: {
    sac?: boolean;
    vpat?: boolean;
    pdfBasic?: boolean;
  };
};

export type ProjectBilling = {
  calls: number;
  checked: number;
  exceeds: boolean;
  usage: ProjectUsage;
};

export type ProjectApiCalls = {
  limit: ProjectUsage;
  used: ProjectUsage;
  reset: Date | string;
};

export type ProjectRole = {
  _id: string;
  title: string;
  default: boolean;
  admin: boolean;
};

export type FormAccessInfo = {
  _id: string;
  name: string;
  path: string;
  title: string;
  access: Record<string, Access>;
  submissionAccess: Record<string, Access>;
};

export type ProjectAccessInfo = {
  roles: Record<string, ProjectRole>;
  forms: Record<string, FormAccessInfo>;
};
