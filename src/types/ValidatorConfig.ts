import { Evaluator } from "utils/Evaluator";
import { Database } from "utils/Database"

export type ValidatorConfig = {
    database?: Database;
    evaluator?: Evaluator;
    token?: string;
}
