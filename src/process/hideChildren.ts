import { set } from 'lodash';
import {
    ProcessorScope,
    ProcessorContext,
    ProcessorInfo,
    ProcessorFnSync,
    ConditionsScope,
    Component,
    ProcessorFn,
} from "types";
import { componentInfo, eachComponentData, getComponentPath } from 'utils/formUtil';

/**
 * This processor function checks components for the `hidden` property and, if children are present, sets them to hidden as well.
 */
export const hideChildrenProcessor: ProcessorFnSync<ConditionsScope> = (context) => {
    const { component, path, row, scope } = context;
    // Check if there's a conditional set for the component and if it's marked as conditionally hidden
    const isConditionallyHidden = scope.conditionals?.find((cond) => {
        return path === cond.path && cond.conditionallyHidden;
    });

    if (!scope.conditionals) {
        scope.conditionals = [];
    }

    if (isConditionallyHidden || component.hidden) {
        const info = componentInfo(component);
        if (info.hasColumns || info.hasComps || info.hasRows) {
            // If this is a container component, we need to make the mutation to all the child components as well.
            eachComponentData([component], row, (comp: Component, data: any, compRow: any, compPath: string) => {
                if (comp !== component) {
                    // the path set here is not the absolute path, but the path relative to the parent component
                    (scope as ConditionsScope).conditionals?.push({ path: getComponentPath(comp, compPath), conditionallyHidden: true });
                }
            });
        }
    }
}

export const hideChildrenProcessorAsync: ProcessorFn<ProcessorScope> = async (context) => {
    return hideChildrenProcessor(context);
};

export const hideChildrenProcessorInfo: ProcessorInfo<ProcessorContext<ProcessorScope>, void> = {
    name: 'hideChildren',
    shouldProcess: () => true,
    processSync: hideChildrenProcessor,
    process: hideChildrenProcessorAsync,
}
