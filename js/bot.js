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
const self_emitter_1 = require('./helpers/self-emitter');
const chat_1 = require('./chat');
class Bot extends self_emitter_1.default {
    constructor({ adapter, scenarios, commands }, id) {
        super();
        this.chats = new Map();
        this.adapter = adapter;
        this.id = id || uuid.v4();
        this.declarations = { scenarios, commands: commands || [] };
        this.bubbleAdapterEvents();
    }
    bubbleAdapterEvents() {
        const originalEmit = this.adapter.emit;
        this.adapter.emit = (event, ...args) => {
            originalEmit.apply(this.adapter, [event, ...args]);
            return this.emit(event, ...args);
        };
    }
    userInput(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('message.get', message);
            const chat = yield this.chat(message.chat, message.type);
            return yield chat.input(message);
        });
    }
    chat(nameOrId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.adapter.getChat(nameOrId, type);
            if (this.chats.has(id)) {
                return this.chats.get(id);
            }
            const chat = new chat_1.default(id, this);
            this.chats.set(id, chat);
            return chat;
        });
    }
    getScenario(title) {
        const { scenarios } = this.declarations;
        return _.find(scenarios, ['title', title]);
    }
    matchScenario(message) {
        const defaultScenario = this.getScenario('default');
        const predicate = t => t.matcher && t.matcher(message);
        return this.declarations.scenarios.find(predicate) || defaultScenario;
    }
    resetChat(id) {
        this.chats.delete(id);
    }
    isCommand(message) {
        return _.some(this.declarations.commands, c => c.matcher(message));
    }
    macthCommand(message) {
        return _.find(this.declarations.commands, c => c.matcher(message));
    }
    user(idOrKeys) {
        return this.adapter.findUser(idOrKeys);
    }
    send(chat, message) {
        if (_.isString(message))
            message = { text: message, attachments: [] };
        const predicate = a => _.set(a, 'callbackId', this.id);
        message.attachments = message.attachments.map(predicate);
        return this.adapter.send(chat, message);
    }
}
__decorate([
    self_emitter_1.default.on('message')
], Bot.prototype, "userInput", null);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLE1BQVksSUFBSSxXQUFNLFdBQ3RCLENBQUMsQ0FEZ0M7QUFDakMsK0JBQXdCLHdCQUV4QixDQUFDLENBRitDO0FBRWhELHVCQUFpQixRQUNqQixDQUFDLENBRHdCO0FBZXpCLGtCQUFpQyxzQkFBVztJQVMxQyxZQUFhLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQWEsRUFBRSxFQUFXO1FBQ2xFLE9BQU8sQ0FBQTtRQVBELFVBQUssR0FBc0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQVExQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN0QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUE7UUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxJQUFJLEVBQUUsRUFBRSxDQUFBO1FBQzNELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0lBQzVCLENBQUM7SUFFTyxtQkFBbUI7UUFDekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJO1lBQ2pDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7WUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDbEMsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztJQUdhLFNB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