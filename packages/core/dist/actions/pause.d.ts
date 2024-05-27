import { Action, FailureHandler } from './action';
export declare class Pause extends Action {
    constructor(onFailure: FailureHandler);
    perform(): boolean;
}
