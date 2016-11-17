"use strict";
const _ = require('lodash');
const DEFAULTS = {
    done: true,
    exit: false,
    storeAs: null,
    nextStep: null,
    nextTopic: null
};
const OPTIONS = [
    'exit',
    'storeAs',
    'nextStep',
    'nextTopic'
];
const alwaysFalse = () => false;
class Query {
    constructor(options = {}) {
        this.step = options.step || '';
        this._options = options;
        this.skipStep = options.skipStep || alwaysFalse;
    }
    returnValue(options = {}) {
        const requiredOptions = _.pick(this._options, OPTIONS);
        const result = _.merge({}, DEFAULTS, requiredOptions, options);
        return result;
    }
    get errorExit() {
        return {
            exit: true,
            error: true
        };
    }
    get skippingState() {
        return this.returnValue({ done: true, exit: false });
    }
    formatMessage(message, state) {
        return _.isFunction(message) ? message(state) : message;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Query;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcXVlcmllcy9xdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxDQUFDLFdBQU0sUUFDbkIsQ0FBQyxDQUQwQjtBQU8zQixNQUFNLFFBQVEsR0FBRztJQUNmLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLEtBQUs7SUFDWCxPQUFPLEVBQUUsSUFBSTtJQUNiLFFBQVEsRUFBRSxJQUFJO0lBQ2QsU0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQTtBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ2QsTUFBTTtJQUNOLFNBQVM7SUFDVCxVQUFVO0lBQ1YsV0FBVztDQUNaLENBQUE7QUErQkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUE7QUFFL0I7SUFLRSxZQUFhLE9BQU8sR0FBaUIsRUFBRTtRQUNyQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxXQUFXLENBQUE7SUFDakQsQ0FBQztJQUlELFdBQVcsQ0FBRSxPQUFPLEdBQXVCLEVBQUU7UUFDM0MsTUFBTSxlQUFlLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBNEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNqRixNQUFNLE1BQU0sR0FBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUMzRSxNQUFNLENBQUMsTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQUVELElBQUksU0FBUztRQUNYLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxJQUFJO1lBQ1YsS0FBSyxFQUFFLElBQUk7U0FDWixDQUFBO0lBQ0gsQ0FBQztJQUVELElBQUksYUFBYTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBRUQsYUFBYSxDQUFFLE9BQXlELEVBQUUsS0FBYTtRQUNyRixNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFBO0lBQ3pELENBQUM7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsS0FBSyxDQUFBIn0=