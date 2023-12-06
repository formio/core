import { ProcessorContext } from "..";
import { FetchScope } from "./FetchScope";

type AdditionalFetchContext = {
    fetch?: (url: string, options?: RequestInit) => Promise<Response>;
    headers?: Record<string, string>;
}

export type FetchContext = ProcessorContext<FetchScope> & AdditionalFetchContext;