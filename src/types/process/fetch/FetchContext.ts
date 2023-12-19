import { ProcessorContext } from "../ProcessorContext";
import { FetchScope } from "./FetchScope";
export type FetchProcessContext = {
    fetch?: (url: string, options?: RequestInit) => Promise<Response>;
    headers?: Record<string, string>;
};
export type FetchContext = ProcessorContext<FetchScope> & FetchProcessContext;