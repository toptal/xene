/// <reference types="node" />
import { EventEmitter } from 'events';
import { default as BotMessage } from './messages/bot';
interface Adapter extends EventEmitter {
    sendMessage(message: BotMessage): void;
    getUser(id: string): any;
}
export default Adapter;
