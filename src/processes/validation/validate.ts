import { FieldError } from 'error/FieldError';
import { Component, MetaProcess, ProcessType } from 'types';
import { eachComponentDataAsync } from 'utils/formUtil';
import { process as processValidation } from 'validation/process';

// TODO: This is a cheatcode and should be incorporated into a model/decorator
export async function validate(
    components: Component[],
    data: Record<string, any>
): Promise<FieldError[]> {
    let errors: FieldError[] = [];
    await eachComponentDataAsync(components, data, async (component: any, data: any) => {
        const newErrors: FieldError[] = await processValidation({
            component,
            data,
            config: {
                context: { process: ProcessType.Validation, metaProcess: MetaProcess.Validate },
            },
        });
        if (newErrors.length > 0) {
            errors = [...errors, ...newErrors];
        }
    });
    return errors;
}
