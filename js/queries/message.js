"use strict";
const query_1 = require('./query');
class Message extends query_1.default {
    constructor(message, options) {
        super(options);
        this.message = message;
    }
    handle(state, bot, message) {
        if (this.skipStep(state, bot)) {
            return this.skippingState;
        }
        return this.returnValue({
            message: this.formatMessage(this.message, state)
        });
    }
}
exports.Message = Message;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (message, options) => {
    return () => new Message(message, options || {});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9xdWVyaWVzL21lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLHdCQUlPLFNBR1AsQ0FBQyxDQUhlO0FBR2hCLHNCQUE2QixlQUFLO0lBR2hDLFlBQWEsT0FBeUQsRUFBRSxPQUFxQjtRQUMzRixNQUFNLE9BQU8sQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQUVELE1BQU0sQ0FBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLE9BQWU7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQzNCLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztTQUNqRCxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQWhCWSxlQUFPLFVBZ0JuQixDQUFBO0FBRUQ7a0JBQWUsQ0FBQyxPQUF5RCxFQUFFLE9BQXNCO0lBQy9GLE1BQU0sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLElBQUksRUFBRSxDQUFDLENBQUE7QUFDbEQsQ0FBQyxDQUFBIn0=