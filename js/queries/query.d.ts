/// <reference types="chai" />
import Bot from '../bot';
import { PartialMessage, PartialMessageResolver } from '../types/messages/bot';
export interface QueryOptions {
    step?: string;
    exit?: boolean;
    storeAs?: string;
    nextStep?: string;
    nextTopic?: string;
    skipStep?: (state: any, bot: Bot) => boolean;
}
export declare type QueryReturn = {
    done: boolean;
    exit: boolean;
    value?: any;
    storeAs?: string | symbol;
    nextStep?: string;
    nextTopic?: string;
    message: string | PartialMessage;
};
export declare type PartialQueryReturn = {
    done?: boolean;
    exit?: boolean;
    value?: any;
    storeAs?: string | symbol;
    nextStep?: string;
    nextTopic?: string;
    message?: string | PartialMessage;
};
declare abstract class Query {
    step: string;
    _options: QueryOptions;
    skipStep: (state: any, bot: Bot) => boolean;
    constructor(options?: QueryOptions);
    abstract handle(state: Object, bot: Bot, message: any): Promise<QueryReturn> | QueryReturn;
    returnValue(options?: PartialQueryReturn): QueryReturn;
    readonly errorExit: {
        exit: boolean;
        error: boolean;
    };
    readonly skippingState: {
        done: boolean;
        exit: boolean;
        value?: any;
        storeAs?: string | symbol;
        nextStep?: string;
        nextTopic?: string;
        message: string | PartialMessage;
    };
    formatMessage(message: PartialMessageResolver | PartialMessage | string, state: Object): PartialMessage | string;
}
export default Query;
