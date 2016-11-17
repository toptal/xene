import Topic from './types/topic';
import Command from './types/command';
import Adapter from './types/adapter';
import { default as User, SearchUser } from './types/user';
import { default as BotMessage } from './types/messages/bot';
import SelfEmitter from './helpers/self-emitter';
export declare type BotOptions = {
    topics: Topic[];
    adapter: Adapter;
    commands?: Command[];
};
export default class Bot extends SelfEmitter {
    id: string;
    adapter: Adapter;
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
    user(idOrKeys: string | SearchUser): User;
    sendMessage(message: BotMessage): void;
}
