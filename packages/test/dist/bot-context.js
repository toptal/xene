"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotContext = void 0;
const lodash_1 = require("lodash");
const expectation_1 = require("./expectation");
class BotContext {
    constructor(_subject) {
        this._subject = _subject;
        this.on = expectation_1.Expectation.create(this);
        this.messages = [];
        this._expects = [];
        this._subject.say = this._check.bind(this);
    }
    get lastMessage() {
        return this.messages[this.messages.length - 1];
    }
    said(message, channel) {
        return this.messages.some(m => channel ? (0, lodash_1.isEqual)(m, { channel, message }) : (0, lodash_1.isEqual)(m.message, message));
    }
    reset() {
        this._expects = [];
        this.messages = [];
    }
    /** @internal */
    _add(check, message, channel, user) {
        this._expects.push({ check, message, channel, user });
        if (this._expects.length !== 1)
            return;
        this._prepareNext();
    }
    _check(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messages.push({ channel, message });
            if (this._expects.length === 0)
                return;
            this._expects.shift().check(channel, message);
            if (this._expects.length === 0)
                return;
            this._prepareNext();
        });
    }
    _prepareNext() {
        const last = this._expects[this._expects.length - 1];
        const id = `I${Math.random().toString()}`;
        const { message, channel, user } = last;
        const bot = this._subject;
        bot.onMessage({ text: message, channel, user, id });
    }
}
exports.BotContext = BotContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LWNvbnRleHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYm90LWNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsbUNBQXNDO0FBQ3RDLCtDQUEyQztBQUszQyxNQUFhLFVBQVU7SUFLckIsWUFBb0IsUUFBVztRQUFYLGFBQVEsR0FBUixRQUFRLENBQUc7UUFKL0IsT0FBRSxHQUFHLHlCQUFXLENBQUMsTUFBTSxDQUFVLElBQUksQ0FBQyxDQUFBO1FBQ3RDLGFBQVEsR0FBeUQsRUFBRSxDQUFBO1FBQzNELGFBQVEsR0FBc0IsRUFBRSxDQUFBO1FBR3RDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVDLENBQUM7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELElBQUksQ0FBQyxPQUE2QixFQUFFLE9BQWdCO1FBQ2xELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUEsZ0JBQUUsRUFBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxnQkFBRSxFQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtJQUNoRyxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsSUFBSSxDQUFDLEtBQWUsRUFBRSxPQUFlLEVBQUUsT0FBZSxFQUFFLElBQVk7UUFDbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ3JELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU07UUFDdEMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFYSxNQUFNLENBQUMsT0FBZSxFQUFFLE9BQVk7O1lBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7WUFDeEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO2dCQUFFLE9BQU07WUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxPQUFNO1lBQ3RDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtRQUNyQixDQUFDO0tBQUE7SUFFTyxZQUFZO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDcEQsTUFBTSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQTtRQUN6QyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUE7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQWUsQ0FBQTtRQUNoQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDckQsQ0FBQztDQUNGO0FBNUNELGdDQTRDQyJ9