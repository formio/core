import { isEmpty, isObject, remove } from "lodash";
import { Component, ContainerComponent, NestedArrayComponent, ProcessorContext, ProcessorFn, ProcessorFnSync, ProcessorInfo, ProcessorScope } from "types";
import { eachComponent, isComponentModelType, getComponentAbsolutePath, componentDataPath } from "utils/formUtil";
import { get } from "lodash";

function isDataObjectComponent(component: Component): component is ContainerComponent {
  return isComponentModelType(component, 'dataObject');
}

function isArrayComponent(component: Component): component is ContainerComponent {
  return isComponentModelType(component, 'array');
}

export const processInvalidFields: ProcessorFn<ProcessorScope> = async (context) => {
    processInvalidFieldsSync(context);
};
export const processInvalidFieldsSync: ProcessorFnSync<ProcessorScope> =  (context) => {
    const {component,path, data, form} = context;
    // console.log(component.key);

    if(isDataObjectComponent(component)){
        // console.log({component, path});
        console.log({absolutePath: getComponentAbsolutePath(component)});
        
        const dataObj = get(data, `${path}.data`) as Record<string,any> ;
        const topLevelKeys = new Set<string>();

        
        eachComponent(component.components, (comp: Component, compPath: string) => {
            const topLevelComponentKeys = compPath.replace(`${path}.`, '').split('.')[0];    
            topLevelKeys.add(topLevelComponentKeys);
                
            });
        console.log({topLevelKeys});
        
        if(dataObj && isObject(dataObj)){
            const dataObjKeys = Object.keys(dataObj);
            const invalidDataKeys = dataObjKeys.filter(dataKey => !topLevelKeys.has(dataKey));
            console.log({invalidDataKeys});
            
            invalidDataKeys.forEach((key: string) => delete dataObj[key]);

        }
        
    } else if(isArrayComponent(component)){
        const componentKeys = component.components?.map((comp:Component) => comp.key);
        const dataRecords = get(data, path) as Record<string,any>[];
        const invalidElements: {index: number, key: string}[] = dataRecords?.map((record, index: number) => {
            const recordKeys = Object.keys(record);            
            const invalidKeys = recordKeys.filter(dataRecordKey => !componentKeys.includes(dataRecordKey));
            return invalidKeys?.map(key => ({index, key}));
        }).flat();    
        // console.log({componentKeys, dataRecords, invalidElements});
        invalidElements?.forEach(element => {
            delete dataRecords[element.index][element.key];
            if(isEmpty(dataRecords[element.index])){
                dataRecords.splice(element.index, 1);
            }
        });
    }

}



export const removeInvalidFieldsProcessInfo: ProcessorInfo<ProcessorContext<ProcessorScope>, void> = {
    name: 'removeInvalidFields',
    shouldProcess: () => true,
    processSync: processInvalidFieldsSync,
    process: processInvalidFields,
    

}

