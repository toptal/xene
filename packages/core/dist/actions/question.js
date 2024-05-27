"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const parse_1 = require("./parse");
class Question extends parse_1.Parse {
    constructor(_ask, parser, onFailure) {
        super(parser, onFailure || _ask);
        this._ask = _ask;
        this.wasAsked = false;
    }
    ask() {
        if (this.wasAsked)
            return;
        this.wasAsked = true;
        this._ask();
    }
    perform(message) {
        const parsed = this._parse(message.text);
        const isValid = this._isValid(parsed);
        if (isValid)
            this._resolvable.resolve(parsed);
        return isValid;
    }
}
exports.Question = Question;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9xdWVzdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBK0I7QUFHL0IsTUFBYSxRQUFrQixTQUFRLGFBQVE7SUFHN0MsWUFDUyxJQUFlLEVBQ3RCLE1BQW9CLEVBQ3BCLFNBQWtDO1FBQ2hDLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFBO1FBSDNCLFNBQUksR0FBSixJQUFJLENBQVc7UUFIaEIsYUFBUSxHQUFHLEtBQUssQ0FBQTtJQU1hLENBQUM7SUFFdEMsR0FBRztRQUNELElBQUksSUFBSSxDQUFDLFFBQVE7WUFBRSxPQUFNO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNiLENBQUM7SUFFRCxPQUFPLENBQUMsT0FBb0I7UUFDMUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNyQyxJQUFJLE9BQU87WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM3QyxPQUFPLE9BQU8sQ0FBQTtJQUNoQixDQUFDO0NBQ0Y7QUFyQkQsNEJBcUJDIn0=