import { ModelInterface } from './EventEmitter';
export { ModelInterface };
export interface ModelDecoratorInterface {
    (BaseClass?: ModelInterface): ModelInterface;
}
export declare function Model(props?: any): ModelDecoratorInterface;
