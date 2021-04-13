export interface ModelInterface {
    component?: any;
    options?: any;
    data?: any;
    new (component?: any, options?: any, data?: any): any;
}
import EventEmitterBase from 'eventemitter3';
export declare function EventEmitter(BaseClass?: any): ModelInterface;
export { EventEmitterBase };
