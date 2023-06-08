import { Evaluator, Database } from "utils";

export type ValidatorConfig = {
    database?: Database;
    evaluator?: Evaluator;
    token?: string;
}
