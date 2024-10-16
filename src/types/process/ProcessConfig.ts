import { Evaluator, Database } from 'utils';

export type ProcessConfig = {
  database?: Database;
  evaluator?: Evaluator;
  token?: string;
};
