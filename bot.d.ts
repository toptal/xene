import SelfEmitter from './helpers/self-emitter';
import Chat from './chat';
import Adapter from './types/adapter';
import Command from './types/command';
import Scenario from './types/scenario';
import { default as BotMessage } from './types/messages/bot';
export declare type BotOptions = {
    adapter: Adapter;
    commands?: Command[];
    scenarios: Scenario[];
};
export default class Bot extends SelfEmitter {
    id: string;
    adapter: Adapter;
    private chats;
    private declarations;
    constructor({adapter, scenarios, commands}: BotOptions, id?: string);
    private bubbleAdapterEvents();
    private userInput(message);
    chat(nameOrId: string, type: string): Promise<Chat>;
    getScenario(title: string): Scenario;
    matchScenario(message: string): Scenario;
    resetChat(id: string): void;
    private isCommand(message);
    private macthCommand(message);
    send(chat: string, message: string | BotMessage): Promise<any>;
}
