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
        this.topics = [];
        this.commands = [];
        this.chats = new Map();
        this.id = id || uuid.v4();
        this.topics = options.topics;
        this.adapter = options.adapter;
        this.commands = options.commands || [];
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
            this.emit('message.get', message);
            if (!this.commands || !this.topics) {
                return;
            }
            const chat = this.getChat(chatId, text, user);
            if (this.isCommand(text)) {
                const command = this.parseCommand(text);
                const commandMessage = strictify_message_1.default(command.message, chatId);
                this.sendMessage(commandMessage);
                return this.emit(`command.${command.command}`, command);
            }
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
        if (!chat) {
            return message;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLE1BQVksSUFBSSxXQUFNLFdBQ3RCLENBQUMsQ0FEZ0M7QUFDakMsdUJBQWlCLFFBRWpCLENBQUMsQ0FGd0I7QUFRekIsK0JBQXdCLHdCQUN4QixDQUFDLENBRCtDO0FBQ2hELGdDQUF5Qix5QkFDekIsQ0FBQyxDQURpRDtBQUNsRCxvQ0FBNkIsNkJBRTdCLENBQUMsQ0FGeUQ7QUFRMUQsa0JBQWlDLHNCQUFXO0lBTzFDLFlBQWEsT0FBbUIsRUFBRSxFQUFXO1FBQzNDLE9BQU8sQ0FBQTtRQUxELFdBQU0sR0FBWSxFQUFFLENBQUE7UUFDcEIsYUFBUSxHQUFjLEVBQUUsQ0FBQTtRQUN4QixVQUFLLEdBQXNCLElBQUksR0FBRyxFQUFFLENBQUE7UUFJMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUE7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTtRQUN0QyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDcEIsQ0FBQztJQUVPLFdBQVc7UUFDakIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJO1lBQ2pDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLElB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