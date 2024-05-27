import { Bot } from './bot';
import { IManager } from './channel';
import { UserMessage } from './types';
import { Action } from './actions/action';
export declare class Manager implements IManager {
    private _bot;
    private _channelID;
    users: string[];
    emit: (event: string, ...args: any[]) => void;
    on: (event: string, cb: import("./ee").CB) => void;
    private _queue;
    private _messages;
    constructor(_bot: Bot, _channelID: string, users: string[]);
    /**
     * For questions call to ask is required and so it
     * should be just added to the end of queue until
     * previous question/parsers finish.
     *
     * For Parser there no need to prepare it
     * and it's possible just to parse last message
     * since it may contain info parser tries to get
     * (unlike questions, which need to ask question
     * before parsing). So call to parse here will do
     * almost the same thing as in perform but without
     * triggering error hander of parser to not mess
     * up with queue. If it fails then same flow applied
     * as for question e.g. add to queue.
     */
    add(action: Action): void;
    prepare(): void;
    perform(message: UserMessage): any;
    unpause(): void;
    abort(): void;
    unbind(): void;
    private get _lastMessage();
    private get _channel();
    private get _isEmpty();
    private get _head();
}
