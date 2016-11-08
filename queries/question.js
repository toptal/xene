"use strict";
const parse_1 = require('./parse');
class Question extends parse_1.Parse {
    constructor(question, options) {
        super(options.parser, options);
        this.isMessageSend = false;
        this.question = question;
        this.errorMessage = options.errorMessage || question;
    }
    handle(state, bot, message) {
        if (this.skipStep(state, bot)) {
            return this.skippingState;
        }
        if (!this.isMessageSend) {
            console.log('sendMessage');
            this.isMessageSend = true;
            return this.returnValue({
                message: this.formatMessage(this.question, state),
                done: false,
                exit: false
            });
        }
        return super.handle(state, bot, message);
    }
}
exports.Question = Question;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (message, options) => {
    if (!options.validator && !options.validators) {
        throw new Error('Query builder `question` called without any `validator`.');
    }
    return () => new Question(message, options);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcmllcy9xdWVzdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBTUEsd0JBQTZDLFNBRTdDLENBQUMsQ0FGcUQ7QUFNdEQsdUJBQThCLGFBQUs7SUFJakMsWUFBYSxRQUFRLEVBQUUsT0FBTztRQUM1QixNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFIaEMsa0JBQWEsR0FBWSxLQUFLLENBQUE7UUFJNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQTtJQUN0RCxDQUFDO0lBRUQsTUFBTSxDQUFFLEtBQWEsRUFBRSxHQUFRLEVBQUUsT0FBZTtRQUM5QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUE7UUFDM0IsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUMxQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtZQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDdEIsT0FBTyxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUM7Z0JBQ2pELElBQUksRUFBRSxLQUFLO2dCQUNYLElBQUksRUFBRSxLQUFLO2FBQ1osQ0FBQyxDQUFBO1FBQ0osQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDMUMsQ0FBQztBQUNILENBQUM7QUEzQlksZ0JBQVEsV0EyQnBCLENBQUE7QUFFRDtrQkFBZSxDQUNiLE9BQTBELEVBQzFELE9BQXdCO0lBRXhCLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQTtJQUM3RSxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzdDLENBQUMsQ0FBQSJ9