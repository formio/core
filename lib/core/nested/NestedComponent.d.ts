import { ComponentSchema, ComponentInterface } from '../component/Component';
export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}
export declare const NestedComponentBase: (...props: any) => ComponentInterface;
export declare function NestedComponentWithModel(ModelClass: any): (...props: any) => ComponentInterface;
export declare const NestedComponent: (...props: any) => ComponentInterface;
