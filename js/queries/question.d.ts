/// <reference types="chai" />
import Bot from '../bot';
import { QueryReturn } from './query';
import { PartialMessage, PartialMessageResolver } from '../types/messages/bot';
import { Parse, Parser, ParserOptions } from './parse';
export interface QuestionOptions extends ParserOptions {
    parser: Parser;
}
export declare class Question extends Parse {
    question: PartialMessage | PartialMessageResolver | string;
    isMessageSend: boolean;
    constructor(question: any, options: any);
    handle(state: Object, bot: Bot, message: string): QueryReturn;
}
declare var _default: (message: string | PartialMessage | PartialMessageResolver, options: QuestionOptions) => () => Question;
export default _default;
