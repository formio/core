import { Database } from 'utils';
import { Evaluator } from 'utils';

export type ProcessConfig = {
  database?: Database;
  evaluator?: typeof Evaluator;
  token?: string;
};
