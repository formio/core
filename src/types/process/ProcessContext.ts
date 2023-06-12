import { MetaProcess } from "./MetaProcess.js";
import { ProcessType } from "./ProcessType.js";

export type ProcessContext = {
    metaProcess?: MetaProcess,
    process: ProcessType,
}
