import { Evaluator } from "../evaluator/Evaluator";
import { Database } from "../database/Database"

export type ValidatorConfig = {
    database?: Database;
    evaluator?: Evaluator;
    token?: string;
}
