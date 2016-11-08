/// <reference types="node" />
import { EventEmitter } from 'events';
export default class SelfEmitter extends EventEmitter {
    private _toBind;
    constructor();
    __selfBind(): void;
    static on(event: string): (target: any, key: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
}
