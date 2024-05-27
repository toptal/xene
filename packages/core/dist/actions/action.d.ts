import { UserMessage } from '../types';
export type FailureHandler = (message: string) => any;
export declare abstract class Action {
    protected _onFailure?: FailureHandler;
    constructor(_onFailure?: FailureHandler);
    failed(message: UserMessage): void;
    get hasFailureHandler(): boolean;
    abstract perform(message: UserMessage): boolean;
}
