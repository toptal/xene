import { Resolvable } from '../resolvable';
import { Action, FailureHandler } from './action';
import { UserMessage, ParseType } from '../types';
export declare class Parse<T = any> extends Action {
    protected _resolvable: Resolvable<T>;
    protected _parse: (reply: string) => T;
    constructor(parser: ParseType<T>, onFailure?: FailureHandler);
    perform(message: UserMessage): boolean;
    get promise(): Promise<T>;
    protected _isValid(parsed: T): boolean;
}
