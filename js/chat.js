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
const format_string_1 = require('./helpers/format-string');
const strictify_message_1 = require('./helpers/strictify-message');
class Chat {
    constructor(id, user, bot) {
        this.id = id;
        this.user = user;
        this.bot = bot;
        this.state = {};
    }
    setTopic(topic) {
        const resolvedQueries = topic.queries.map(q => q());
        this.queries = resolvedQueries;
        this.query = _.head(resolvedQueries);
    }
    handleMessage(messageText) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var result = yield this.query.handle(this.state, this.bot, messageText);
            }
            catch (e) {
                return this.error(e);
            }
            if (result.message) {
                this.sendMessage(result.message);
            }
            const { exit, done, nextTopic } = result;
            if (exit || !done) {
                return { done: exit, next: (exit ? nextTopic : null) };
            }
            this.nextQuery(result.nextStep);
            const { storeAs, value } = result;
            if (storeAs && value) {
                this.state[storeAs] = value;
            }
            return yield this.handleMessage(messageText);
        });
    }
    error(e) {
        console.error(e);
        return { error: e, done: true, next: null };
    }
    nextQuery(key) {
        let nextIndex = this.queries.indexOf(this.query) + 1;
        nextIndex = key ? _.findIndex(this.queries, ['step', key]) : nextIndex;
        this.query = this.queries[nextIndex];
    }
    sendMessage(message) {
        const botMessage = strictify_message_1.default(message, this.id);
        botMessage.text = format_string_1.default(botMessage.text, this.state),
            this.bot.sendMessage(botMessage);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFNM0IsZ0NBQXlCLHlCQUN6QixDQUFDLENBRGlEO0FBQ2xELG9DQUE2Qiw2QkFFN0IsQ0FBQyxDQUZ5RDtBQUUxRDtJQUtFLFlBQW9CLEVBQVUsRUFBUyxJQUFXLEVBQVUsR0FBUTtRQUFoRCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBTztRQUFVLFFBQUcsR0FBSCxHQUFHLENBQUs7UUFINUQsVUFBSyxHQUFXLEVBQUUsQ0FBQTtJQUc4QyxDQUFDO0lBRWxFLFFBQVEsQ0FBRSxLQUFZO1FBQzNCLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBRVksYUFBYSxDQUFFLFdBQW1COztZQUM3QyxJQUFJLENBQUM7Z0JBQ0gsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFDekUsQ0FBRTtZQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdEIsQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNsQyxDQUFDO1lBRUQsTUFBTSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLEdBQUcsTUFBTSxDQUFBO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBO1lBQ3hELENBQUM7WUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUUvQixNQUFNLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxHQUFHLE1BQU0sQ0FBQTtZQUMvQixFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUE7WUFDN0IsQ0FBQztZQUNELE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDOUMsQ0FBQztLQUFBO0lBRU8sS0FBSyxDQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hCLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUE7SUFDN0MsQ0FBQztJQUVPLFNBQVMsQ0FBRSxHQUFHO1FBQ3BCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEQsU0FBUyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUE7UUFDdEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFFTyxXQUFXLENBQUUsT0FBZ0M7UUFDbkQsTUFBTSxVQUFVLEdBQUcsMkJBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNyRCxVQUFVLENBQUMsSUFBSSxHQUFHLHVCQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7QUFDSCxDQUFDO0FBdEREO3NCQXNEQyxDQUFBIn0=