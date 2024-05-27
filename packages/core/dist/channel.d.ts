import { UserMessage } from './types';
export interface IManager {
    users: string[];
    perform(msg: UserMessage): Promise<boolean>;
    prepare(): any;
    abort(): any;
}
export declare class Channel {
    private _managers;
    private _allManagers;
    add(manager: IManager): void;
    processMessage(message: UserMessage): void;
    hasFor(user: string): boolean;
    bind(manager: IManager): void;
    without(manager: IManager): void;
    abort(user: string): void;
    private _prepareNext;
    private _headFor;
}
