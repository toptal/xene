"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tester = void 0;
const user_context_1 = require("./user-context");
const bot_context_1 = require("./bot-context");
class Tester {
    constructor(_subject) {
        this._subject = _subject;
        this.bot = new bot_context_1.BotContext(this._subject);
        this.user = new user_context_1.UserContext(this._subject);
    }
}
exports.Tester = Tester;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rlc3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpREFBNEM7QUFDNUMsK0NBQTBDO0FBRTFDLE1BQWEsTUFBTTtJQUdqQixZQUFvQixRQUFXO1FBQVgsYUFBUSxHQUFSLFFBQVEsQ0FBRztRQUYvQixRQUFHLEdBQUcsSUFBSSx3QkFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNuQyxTQUFJLEdBQUcsSUFBSSwwQkFBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNGLENBQUM7Q0FDckM7QUFKRCx3QkFJQyJ9