"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binder = void 0;
const withoutGlobal = (rx) => new RegExp(rx, rx.flags.replace('g', ''));
const stringMatcher = (str) => (message) => message.text === str;
const regExpMatcher = (rx) => (message) => withoutGlobal(rx).test(message.text);
const normalizeMatcher = (matcher) => {
    if (typeof matcher === 'function')
        return matcher;
    else if (matcher instanceof RegExp)
        return regExpMatcher(matcher);
    else if (typeof matcher === 'string')
        return stringMatcher(matcher);
    else
        throw new Error(`Don't know how to match messages with ${matcher}.`);
};
class Binder {
    static for(bot) {
        return (matcher) => new Binder(bot, matcher);
    }
    constructor(_bot, _matcher) {
        this._bot = _bot;
        this._matcher = _matcher;
    }
    say(message) {
        const match = normalizeMatcher(this._matcher);
        const handler = (msg, bot) => bot.say(msg.channel, message);
        this._bot._performerHandlers.push({ match, handler });
        return this._bot;
    }
    do(handler) {
        const match = normalizeMatcher(this._matcher);
        this._bot._performerHandlers.push({ match, handler });
        return this._bot;
    }
    talk(handler) {
        const match = normalizeMatcher(this._matcher);
        this._bot._dialogHandlers.push({ match, handler });
        return this._bot;
    }
}
exports.Binder = Binder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2JpbmRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxNQUFNLGFBQWEsR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQ25DLElBQUksTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUUzQyxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFLENBQ3BDLENBQUMsT0FBb0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUE7QUFFaEQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRSxDQUNuQyxDQUFDLE9BQW9CLEVBQUUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBRWhFLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxPQUFtQixFQUFXLEVBQUU7SUFDeEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVO1FBQUUsT0FBTyxPQUFPLENBQUE7U0FDNUMsSUFBSSxPQUFPLFlBQVksTUFBTTtRQUFFLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQzVELElBQUksT0FBTyxPQUFPLEtBQUssUUFBUTtRQUFFLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztRQUM5RCxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxPQUFPLEdBQUcsQ0FBQyxDQUFBO0FBQzNFLENBQUMsQ0FBQTtBQUVELE1BQWEsTUFBTTtJQUNqQixNQUFNLENBQUMsR0FBRyxDQUFnQixHQUFNO1FBQzlCLE9BQU8sQ0FBQyxPQUFtQixFQUFFLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBSSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDN0QsQ0FBQztJQUVELFlBQW9CLElBQU8sRUFBVSxRQUFvQjtRQUFyQyxTQUFJLEdBQUosSUFBSSxDQUFHO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtJQUFJLENBQUM7SUFFOUQsR0FBRyxDQUFDLE9BQTZCO1FBQy9CLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM3QyxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQWdCLEVBQUUsR0FBTSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDM0UsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNyRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVELEVBQUUsQ0FBQyxPQUE4QztRQUMvQyxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNyRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUE7SUFDbEIsQ0FBQztJQUVELElBQUksQ0FBQyxPQUEyQztRQUM5QyxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDbEQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBO0lBQ2xCLENBQUM7Q0FDRjtBQXpCRCx3QkF5QkMifQ==