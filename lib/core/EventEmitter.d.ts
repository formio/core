import EventEmitterBase from 'eventemitter3';
export declare function EventEmitter(Base: any): {
    new (): {
        [x: string]: any;
        events: EventEmitterBase;
        emit(event: any, ...args: any): boolean;
        on(event: any, fn: any, ...args: any): EventEmitterBase<string | symbol, any>;
        once(event: any, fn: any, ...args: any): EventEmitterBase<string | symbol, any>;
        off(event: any, ...args: any): EventEmitterBase<string | symbol, any>;
    };
    [x: string]: any;
};
export { EventEmitterBase };
