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
const ava_1 = require("ava");
const core_1 = require("@xene/core");
const __1 = require("../");
class Bot extends core_1.Bot {
    say(channel, msg) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    listen() { return this; }
}
const subject = (0, __1.wrap)(new Bot()
    .when(m => m.text === '2' && m.channel === 'c1' && m.user === 'u1').say('7')
    .when(m => m.text === '2' && m.channel === 'c1').say('3')
    .when('3').say({ message: ['3'] })
    .when('1').say('2'));
ava_1.default.serial('UserContext', t => {
    subject.user.says('1');
    t.true(subject.bot.said('2'));
    t.false(subject.bot.said('3'));
});
ava_1.default.serial('BotContext', (t) => __awaiter(void 0, void 0, void 0, function* () {
    t.true(yield subject.bot.on('2', 'c1').says('3'));
    t.true(yield subject.bot.on('2', 'c1', 'u1').says('7', 'c1'));
    t.true(yield subject.bot.on('3').says({ message: ['3'] }));
    t.false(yield subject.bot.on('3').says({ message: ['3', '32'] }));
    t.true(subject.bot.messages.length !== 0);
    subject.bot.reset();
    t.true(subject.bot.messages.length === 0);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0L2Zsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2QkFBc0I7QUFDdEIscUNBQTJDO0FBQzNDLDJCQUEwQjtBQUUxQixNQUFNLEdBQUksU0FBUSxVQUF3QjtJQUNsQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUc7OERBQWUsQ0FBQztLQUFBO0lBQ3RDLE1BQU0sS0FBSyxPQUFPLElBQUksQ0FBQSxDQUFDLENBQUM7Q0FDekI7QUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFBLFFBQUksRUFBQyxJQUFJLEdBQUcsRUFBRTtLQUMzQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7S0FDM0UsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0tBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO0tBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQ3BCLENBQUE7QUFFRCxhQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRTtJQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDN0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2hDLENBQUMsQ0FBQyxDQUFBO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBTSxDQUFDLEVBQUMsRUFBRTtJQUNsQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ2pELENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDMUQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUNqRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFBO0lBQ25CLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFBO0FBQzNDLENBQUMsQ0FBQSxDQUFDLENBQUEifQ==