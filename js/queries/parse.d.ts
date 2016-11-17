/// <reference types="chai" />
import Bot from '../bot';
import { RelaxedMessage } from '../types/messages/bot';
import { QueryReturn, QueryOptions, default as Query, PartialQueryReturn } from './query';
export declare type Parser = (message: string, state: Object) => any;
export declare type Validator = (parsed: any, state: any) => boolean;
export declare type Validators = {
    validator: Validator;
    nextStep?: string;
    message?: RelaxedMessage;
}[];
export interface ParserOptions extends QueryOptions {
    validator?: Validator;
    validators?: Validators;
    errorMessage?: RelaxedMessage;
}
export declare class Parse extends Query {
    parser: Parser;
    errorMessage: RelaxedMessage;
    validators: Validators;
    _options: ParserOptions;
    constructor(parser: Parser, options: ParserOptions);
    handle(state: Object, bot: Bot, message: string): QueryReturn;
    validate(parsed: any, state: any): PartialQueryReturn;
}
declare var _default: (parser: (message: string, state: Object) => any, options: ParserOptions) => () => Parse;
export default _default;
