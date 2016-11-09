"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _ = require('lodash');
const uuid = require('node-uuid');
const chat_1 = require('./chat');
const self_emitter_1 = require('./helpers/self-emitter');
const format_string_1 = require('./helpers/format-string');
const strictify_message_1 = require('./helpers/strictify-message');
class Bot extends self_emitter_1.default {
    constructor(options, id) {
        super();
        this.chats = new Map();
        this.id = id || uuid.v4();
        this.topics = options.topics;
        this.adapter = options.adapter;
        this.commands = options.commands;
        this.pipeAdapter();
    }
    pipeAdapter() {
        const originalEmit = this.adapter.emit;
        this.adapter.emit = (event, ...args) => {
            originalEmit.apply(this.adapter, [event, ...args]);
            return this.emit(event, ...args);
        };
    }
    handleMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatId = message.chat;
            const { text, user } = message;
            const chat = this.getChat(chatId, text, user);
            if (this.isCommand(text)) {
                const command = this.parseCommand(text);
                const commandMessage = strictify_message_1.default(command.message, chatId);
                this.sendMessage(commandMessage);
                return this.emit(`command.${command.command}`, command);
            }
            this.emit('message.get', message);
            const { done, next } = yield chat.handleMessage(text);
            if (done) {
                next ? chat.setTopic(this.getTopic(next)) : this.resetChat(chatId);
            }
        });
    }
    getChat(id, text, user) {
        if (this.chats.has(id)) {
            return this.chats.get(id);
        }
        const chat = new chat_1.default(id, user, this);
        chat.setTopic(this.parseTopic(text));
        this.chats.set(id, chat);
        return chat;
    }
    resetChat(id) {
        this.chats.delete(id);
    }
    isCommand(message) {
        return _.some(this.commands, c => c.matcher(message));
    }
    parseCommand(message) {
        return _.find(this.commands, c => c.matcher(message));
    }
    parseTopic(message) {
        const defaultTopic = this.getTopic('default');
        const predicate = t => t.matcher && t.matcher(message);
        return this.topics.find(predicate) || defaultTopic;
    }
    getTopic(topic) {
        return _.find(this.topics, t => t.topic === topic);
    }
    formatMessage(message) {
        const chat = this.chats.get(message.chat);
        const user = this.adapter.getUser(chat.user);
        message.text = format_string_1.default(message.text, { user });
        return message;
    }
    sendMessage(message) {
        this.emit('message.send', message);
        const attachments = message.attachments;
        if (attachments) {
            message.attachments = attachments.map(attachmant => {
                attachmant.callbackId = this.id;
                return attachmant;
            });
        }
        const formatted = this.formatMessage(message);
        this.adapter.sendMessage(formatted);
    }
}
__decorate([
    self_emitter_1.default.on('message')
], Bot.prototype, "handleMessage", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLE1BQVksSUFBSSxXQUFNLFdBQ3RCLENBQUMsQ0FEZ0M7QUFDakMsdUJBQWlCLFFBRWpCLENBQUMsQ0FGd0I7QUFRekIsK0JBQXdCLHdCQUN4QixDQUFDLENBRCtDO0FBQ2hELGdDQUF5Qix5QkFDekIsQ0FBQyxDQURpRDtBQUNsRCxvQ0FBNkIsNkJBRTdCLENBQUMsQ0FGeUQ7QUFRMUQsa0JBQWlDLHNCQUFXO0lBTzFDLFlBQWEsT0FBbUIsRUFBRSxFQUFXO1FBQzNDLE9BQU8sQ0FBQTtRQUhELFVBQUssR0FBc0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUkxQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTtRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUE7UUFDaEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ3BCLENBQUM7SUFFTyxXQUFXO1FBQ2pCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFBO1FBQ3RDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSTtZQUNqQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO1lBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFB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