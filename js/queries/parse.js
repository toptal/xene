"use strict";
const query_1 = require('./query');
class Parse extends query_1.default {
    constructor(parser, options) {
        super(options);
        this.validators = options.validators || [{ validator: options.validator }];
        this.errorMessage = options.errorMessage;
        this.parser = parser;
    }
    handle(state, bot, message) {
        if (this.skipStep(state, bot)) {
            return this.skippingState;
        }
        const parsed = this.parser(message, state);
        const validated = this.validate(parsed, state);
        if (validated) {
            validated.value = parsed;
            return this.returnValue(validated);
        }
        if (this.errorMessage) {
            return this.returnValue({
                message: this.formatMessage(this.errorMessage, state),
                done: false,
                exit: false
            });
        }
        throw new Error("Parse failed and `errorMessage` isn't defined.");
    }
    validate(parsed, state) {
        const validated = this.validators.find(b => b.validator(parsed, state));
        if (!validated) {
            return null;
        }
        const { nextStep, message } = validated;
        return {
            message: message ? this.formatMessage(message, state) : null,
            nextStep
        };
    }
}
exports.Parse = Parse;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (parser, options) => {
    if (!options.validator && !options.validators) {
        throw new Error('Query builder `parse` called without any `validator`.');
    }
    return () => new Parse(parser, options);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcmllcy9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsd0JBS08sU0FFUCxDQUFDLENBRmU7QUFnQmhCLG9CQUEyQixlQUFLO0lBTTlCLFlBQWEsTUFBYyxFQUFFLE9BQXNCO1FBQ2pELE1BQU0sT0FBTyxDQUFDLENBQUE7UUFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUMxRSxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUE7UUFDeEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLE9BQWU7UUFDOUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFBO1FBQzNCLENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUU5QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUE7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDcEMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUN0QixPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQztnQkFDckQsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsSUFBSSxFQUFFLEtBQUs7YUFDWixDQUFDLENBQUE7UUFDSixDQUFDO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFBO0lBQ25FLENBQUM7SUFFRCxRQUFRLENBQUUsTUFBTSxFQUFFLEtBQUs7UUFDckIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUFDLENBQUM7UUFDL0IsTUFBTSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsR0FBRyxTQUFTLENBQUE7UUFDckMsTUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsR0FBRyxJQUFJO1lBQzVELFFBQVE7U0FDVCxDQUFBO0lBQ0gsQ0FBQztBQUNILENBQUM7QUE1Q1ksYUFBSyxRQTRDakIsQ0FBQTtBQUVEO2tCQUFlLENBQUMsTUFBK0MsRUFBRSxPQUFzQjtJQUNyRixFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUE7SUFDMUUsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN6QyxDQUFDLENBQUEifQ==