import { Form } from '../Form';
import { FormAction } from '../Action';
import { ProjectRole } from './Project';
import { Access } from '../Access';

export type ProjectTemplate = {
  title: string;
  version: string;
  description: string;
  name: string;
  roles?: Record<string, ProjectRole>;
  forms?: Record<string, Form>;
  resources?: Record<string, Form>;
  actions?: Record<string, FormAction>;
  access?: Access[];
};
