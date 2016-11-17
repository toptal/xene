/// <reference types="chai" />
import Bot from '../bot';
import { QueryReturn, QueryOptions, default as Query } from './query';
export interface ActionOptions extends QueryOptions {
    onError?: string;
    onSuccess?: string;
}
export declare class Action extends Query {
    action: (state: Object, bot: Bot) => Promise<any>;
    onError?: string;
    onSuccess?: string;
    constructor(action: (state: Object, bot: Bot) => Promise<any>, options: ActionOptions);
    handle(state: Object, bot: Bot, message: string): Promise<QueryReturn>;
}
declare var _default: (action: (state: Object, bot: Bot) => Promise<any>, options?: ActionOptions) => () => Action;
export default _default;
