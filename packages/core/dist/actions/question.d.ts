import { Parse } from './parse';
import { ParseType, UserMessage } from '../types';
export declare class Question<T = any> extends Parse<T> {
    _ask: () => any;
    private wasAsked;
    constructor(_ask: () => any, parser: ParseType<T>, onFailure?: (reply: string) => any);
    ask(): void;
    perform(message: UserMessage): boolean;
}
