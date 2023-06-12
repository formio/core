import { FieldError } from "error/FieldError";
import { Component } from "types";
import { eachComponentDataAsync } from "utils/formUtil";
import { process as processValidation } from "validation/process";

export async function validate(components: Component[], data: Record<string, any>): Promise<FieldError[]> {
    let errors: FieldError[] = [];
    await eachComponentDataAsync(components, data, async (component: any, data: any) => {
        const newErrors: FieldError[] = await processValidation({component, data});
        if (newErrors.length > 0) {
            errors = [...errors, ...newErrors];
        }
    });
    return errors;
}
