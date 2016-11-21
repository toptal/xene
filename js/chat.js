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
        /*
        NOTE we can store userless performers at key `common`
        and check it after check for specific performers for user
        but before we try to create new performer from message
        */
        this.performers = new Map();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFHM0IsNEJBQXNCLGFBQ3RCLENBQUMsQ0FEa0M7QUFRbkM7Ozs7OztFQU1FO0FBQ0Y7SUFTRSxZQUFvQixFQUFVLEVBQVMsR0FBUTtRQUEzQixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBSztRQVAvQzs7OztVQUlFO1FBQ00sZUFBVSxHQUEyQixJQUFJLEdBQUcsRUFBRSxDQUFBO0lBRUosQ0FBQztJQUV0QyxLQUFLLENBQUUsT0FBb0I7O1lBQ3RDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNwRCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDbEQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDN0MsQ0FBRTtZQUFBLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFakIsQ0FBQztRQUNILENBQUM7S0FBQTtJQUVNLGlCQUFpQixDQUN0QixLQUFhLEVBQ2IsSUFBc0M7UUFFdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzFDLENBQUM7SUFFTyxvQkFBb0IsQ0FBQyxPQUFvQjtRQUMvQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQyxtREFBbUQ7UUFDbkQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEQsQ0FBQztJQUVPLFlBQVksQ0FDbEIsUUFBa0IsRUFDbEIsSUFBc0M7UUFFdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxtQkFBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFDckQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7UUFDM0QsTUFBTSxDQUFDLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRU8sZUFBZSxDQUFFLFNBQW9CO1FBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUM7Z0JBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFTSxJQUFJLENBQUUsT0FBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEMsQ0FBQztBQUNILENBQUM7QUF4REQ7c0JBd0RDLENBQUEifQ==