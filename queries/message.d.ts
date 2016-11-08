import Bot from '../bot';
import { PartialMessage, PartialMessageResolver } from '../types/messages/bot';
import { default as Query, QueryOptions, QueryReturn } from './query';
export declare class Message extends Query {
    message: PartialMessage | PartialMessageResolver | string;
    constructor(message: PartialMessage | PartialMessageResolver | string, options: QueryOptions);
    handle(state: Object, bot: Bot, message: string): QueryReturn;
}
declare var _default: (message: string | PartialMessage | PartialMessageResolver, options?: QueryOptions) => () => Message;
export default _default;
