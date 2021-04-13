import { ComponentSchema } from '../component/Component';
import { ModelDecoratorInterface } from '@formio/model';
export interface NestedComponentSchema extends ComponentSchema {
    components: Array<ComponentSchema | any>;
}
export declare function NestedComponent(props?: any): ModelDecoratorInterface;
