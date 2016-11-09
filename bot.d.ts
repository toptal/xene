import Topic from './types/topic';
import Command from './types/command';
import Adapter from './types/adapter';
import { default as BotMessage } from './types/messages/bot';
import SelfEmitter from './helpers/self-emitter';
export declare type BotOptions = {
    adapter: Adapter;
    commands: Command[];
    topics: Topic[];
};
export default class Bot extends SelfEmitter {
    id: string;
    private adapter;
    private topics;
    private commands;
    private chats;
    constructor(options: BotOptions, id?: string);
    private pipeAdapter();
    private handleMessage(message);
    private getChat(id, text, user);
    resetChat(id: string): void;
    private isCommand(message);
    private parseCommand(message);
    private parseTopic(message);
    private getTopic(topic);
    private formatMessage(message);
    sendMessage(message: BotMessage): void;
}
