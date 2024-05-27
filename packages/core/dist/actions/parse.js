"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = void 0;
const resolvable_1 = require("../resolvable");
const action_1 = require("./action");
class Parse extends action_1.Action {
    constructor(parser, onFailure) {
        super(onFailure);
        this._resolvable = new resolvable_1.Resolvable();
        if (typeof parser !== 'function') {
            this._parse = parser.parse;
            this._isValid = parser.isValid;
        }
        else
            this._parse = parser;
    }
    perform(message) {
        const parsed = this._parse(message.text);
        const isValid = this._isValid(parsed);
        if (isValid || !this.hasFailureHandler)
            this._resolvable.resolve(parsed);
        return isValid ? true : !this.hasFailureHandler;
    }
    get promise() {
        return this._resolvable.promise;
    }
    _isValid(parsed) {
        return parsed != null;
    }
}
exports.Parse = Parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWN0aW9ucy9wYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBMEM7QUFDMUMscUNBQWlEO0FBR2pELE1BQWEsS0FBZSxTQUFRLGVBQU07SUFJeEMsWUFBWSxNQUFvQixFQUFFLFNBQTBCO1FBQzFELEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUpSLGdCQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFLLENBQUE7UUFLekMsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFBO1lBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQTtTQUMvQjs7WUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtJQUM3QixDQUFDO0lBRUQsT0FBTyxDQUFDLE9BQW9CO1FBQzFCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckMsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFBO0lBQ2pELENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFBO0lBQ2pDLENBQUM7SUFFUyxRQUFRLENBQUMsTUFBUztRQUMxQixPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUE7SUFDdkIsQ0FBQztDQUNGO0FBM0JELHNCQTJCQyJ9