import { ProcessorScope } from "..";
export type FilterScope = {
    filter: Record<string, {
        compModelType: string;
        include: boolean;
        value?: any;
    }>;
} & ProcessorScope;
