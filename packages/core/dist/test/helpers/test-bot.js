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
exports.TestBot = void 0;
const bot_1 = require("../../bot");
class TestBot extends bot_1.Bot {
    constructor() {
        super(...arguments);
        this.messages = [];
    }
    listen() { return this; }
    say(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.messages.push({ channel, message });
        });
    }
    get lastMessage() {
        return this.messages[this.messages.length - 1];
    }
    incoming(channel, user, text) {
        this.onMessage({ id: '', channel, user, text });
    }
}
exports.TestBot = TestBot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1ib3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdC9oZWxwZXJzL3Rlc3QtYm90LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLG1DQUErQjtBQUUvQixNQUFhLE9BQVEsU0FBUSxTQUFXO0lBQXhDOztRQUNFLGFBQVEsR0FBMkMsRUFBRSxDQUFBO0lBY3ZELENBQUM7SUFiQyxNQUFNLEtBQUssT0FBTyxJQUFJLENBQUEsQ0FBQyxDQUFDO0lBRWxCLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBZTs7WUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUMxQyxDQUFDO0tBQUE7SUFFRCxJQUFJLFdBQVc7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUFlLEVBQUUsSUFBWSxFQUFFLElBQVk7UUFDbEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ2pELENBQUM7Q0FDRjtBQWZELDBCQWVDIn0=