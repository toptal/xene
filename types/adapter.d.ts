/// <reference types="node" />
import { EventEmitter } from 'events';
import { default as BotMessage } from './messages/bot';
interface Adapter extends EventEmitter {
    sendMessage(chat: string, message: BotMessage): Promise<any>;
    getUser(id: string): any;
    getChat(userNameOrChatId: string, type: string): Promise<string>;
}
export default Adapter;
