"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const query_1 = require('./query');
class Action extends query_1.default {
    constructor(action, options) {
        super(options);
        this.action = action;
        this.onError = options.onError || null;
        this.onSuccess = options.onSuccess || options.nextStep;
    }
    handle(state, bot, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.skipStep(state, bot)) {
                return this.skippingState;
            }
            try {
                const value = yield this.action(state, bot);
                return this.returnValue({ nextStep: this.onSuccess, value });
            }
            catch (e) {
                console.error(e);
                if (this.onError) {
                    return this.returnValue({ nextStep: this.onError, done: true });
                }
                throw e;
            }
        });
    }
}
exports.Action = Action;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (action, options = {}) => {
    return () => new Action(action, options);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3F1ZXJpZXMvYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLHdCQUE0RCxTQUU1RCxDQUFDLENBRm9FO0FBT3JFLHFCQUE0QixlQUFLO0lBSy9CLFlBQWEsTUFBaUQsRUFBRSxPQUFzQjtRQUNwRixNQUFNLE9BQU8sQ0FBQyxDQUFBO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQTtRQUN0QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQTtJQUN4RCxDQUFDO0lBRUssTUFBTSxDQUFFLEtBQWEsRUFBRSxHQUFRLEVBQUUsT0FBZTs7WUFDcEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQTtZQUMzQixDQUFDO1lBRUQsSUFBSSxDQUFDO2dCQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7Z0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxDQUFFO1lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFDakUsQ0FBQztnQkFDRCxNQUFNLENBQUMsQ0FBQTtZQUNULENBQUM7UUFDSCxDQUFDO0tBQUE7QUFDSCxDQUFDO0FBNUJZLGNBQU0sU0E0QmxCLENBQUE7QUFFRDtrQkFBZSxDQUFDLE1BQWlELEVBQUUsT0FBTyxHQUFrQixFQUFFO0lBQzVGLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMxQyxDQUFDLENBQUEifQ==