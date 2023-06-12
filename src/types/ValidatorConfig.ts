import { Evaluator, Database } from "utils";
import { ProcessContext } from "./process";

export type ValidatorConfig = {
    database?: Database;
    evaluator?: Evaluator;
    token?: string;
    context?: ProcessContext;
}
