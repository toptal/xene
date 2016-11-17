"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _ = require('lodash');
const performer_1 = require('./performer');
/*
Chat is a representation of channels or groups or even
direct messages. Chat can hold more then one performers
with multiple users in the Chat. Also Chat probides an API
to add, or remove people from Chat or even destroy Chat
if bot has enough ability to do so.
*/
class Chat {
    constructor(id, bot) {
        this.id = id;
        this.bot = bot;
    }
    input(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const performer = this.getOrCreatePerformer(message);
            try {
                const isDone = yield performer.input(message.text);
                if (isDone)
                    this.removePerformer(performer);
            }
            catch (error) {
            }
        });
    }
    performByScenario(title, user) {
        const scenario = this.bot.getScenario(title);
        return this.setPerformer(scenario, user);
    }
    getOrCreatePerformer(message) {
        if (this.performers.has(message.user))
            return this.performers.get(message.user);
        // either scenario based on user message or default
        const scenario = this.bot.matchScenario(message.text);
        return this.setPerformer(scenario, message.user);
    }
    setPerformer(scenario, user) {
        // TODO load users here
        const performer = new performer_1.default(scenario, user, this);
        const users = _.isString(user) ? [user] : _.values(user);
        users.forEach(user => this.performers.set(user, performer));
        return performer;
    }
    removePerformer(performer) {
        this.performers.forEach((value, userId, performers) => {
            if (value == performer)
                performers.delete(userId);
        });
    }
    send(message) {
        return this.bot.send(this.id, message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFHM0IsNEJBQXNCLGFBQ3RCLENBQUMsQ0FEa0M7QUFRbkM7Ozs7OztFQU1FO0FBQ0Y7SUFTRSxZQUFvQixFQUFVLEVBQVMsR0FBUTtRQUEzQixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFFdEMsS0FBSyxDQUFFLE9BQW9COztZQUN0QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDcEQsSUFBSSxDQUFDO2dCQUNILE1BQU0sTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQzdDLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBRWpCLENBQUM7UUFDSCxDQUFDO0tBQUE7SUFFTSxpQkFBaUIsQ0FDdEIsS0FBYSxFQUNiLElBQXNDO1FBRXRDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0lBRU8sb0JBQW9CLENBQUMsT0FBb0I7UUFDL0MsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDMUMsbURBQW1EO1FBQ25ELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyRCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2xELENBQUM7SUFFTyxZQUFZLENBQ2xCLFFBQWtCLEVBQ2xCLElBQXNDO1FBRXRDLHVCQUF1QjtRQUN2QixNQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNyRCxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUMzRCxNQUFNLENBQUMsU0FBUyxDQUFBO0lBQ2xCLENBQUM7SUFFTyxlQUFlLENBQUUsU0FBb0I7UUFDM0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVU7WUFDaEQsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLFNBQVMsQ0FBQztnQkFBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25ELENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLElBQUksQ0FBRSxPQUF5QjtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0FBQ0gsQ0FBQztBQXpERDtzQkF5REMsQ0FBQSJ9