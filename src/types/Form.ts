import { Access, Component, ProjectId, SubmissionId } from 'types';

export type FormId = string;

export interface Form {
  _id?: FormId;
  _vid?: number;

  title?: string;
  name?: string;
  path?: string;
  type?: FormType;
  display?: FormDisplay;
  action?: string;
  tags?: string[];
  access?: Access[];
  submissionAccess?: Access[];
  fieldMatchAccess?: any;
  owner?: SubmissionId;
  machineName?: string;
  components: Component[];
  settings?: FormSettings;
  properties?: Record<string, string>;
  project?: ProjectId;
  revisions?: 'current' | 'original' | '';
  submissionRevisions?: 'true' | '';
  controller?: string;
  builder?: boolean;
  page?: number;

  // Database timestamps
  created?: Date | string;
  modified?: Date | string;
  deleted?: Date | string;
}

export type FormType = 'form' | 'resource';

export type FormDisplay = 'form' | 'pdf' | 'wizard';

export type FormSettings = {
  collection?: string;
  condensedMode?: boolean;
  disableAutocomplete?: boolean;
  fontSize?: number;
  hideTitle: boolean;
  layout?: string;
  margins?: string;
  showCheckboxBacground?: boolean;
  theme?: string;
  viewAsHtml?: boolean;
  viewer?: string;
  wizardHeaderType?: string;
  pdf?: {
    src: string;
    id: string;
  };
};
