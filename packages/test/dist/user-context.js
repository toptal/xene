"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserContext = void 0;
class UserContext {
    constructor(_subject) {
        this._subject = _subject;
    }
    says(text, channel, user) {
        const bot = this._subject;
        const id = `I${Math.random().toString()}`;
        channel = channel || `C${Math.random().toString()}`;
        user = user || `U${Math.random().toString()}`;
        bot.onMessage({ text, channel, user, id });
    }
}
exports.UserContext = UserContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jb250ZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3VzZXItY29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFhLFdBQVc7SUFDdEIsWUFBb0IsUUFBVztRQUFYLGFBQVEsR0FBUixRQUFRLENBQUc7SUFBSSxDQUFDO0lBRXBDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBUSxFQUFFLElBQUs7UUFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQWUsQ0FBQTtRQUNoQyxNQUFNLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFBO1FBQ3pDLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQTtRQUNuRCxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUE7UUFDN0MsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDNUMsQ0FBQztDQUNGO0FBVkQsa0NBVUMifQ==