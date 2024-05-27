"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
class Action {
    constructor(_onFailure) {
        this._onFailure = _onFailure;
    }
    failed(message) {
        if (this.hasFailureHandler)
            this._onFailure(message.text);
    }
    get hasFailureHandler() {
        return Boolean(this._onFailure);
    }
}
exports.Action = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FjdGlvbnMvYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLE1BQXNCLE1BQU07SUFDMUIsWUFBc0IsVUFBMkI7UUFBM0IsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7SUFBSSxDQUFDO0lBRXRELE1BQU0sQ0FBQyxPQUFvQjtRQUN6QixJQUFJLElBQUksQ0FBQyxpQkFBaUI7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVELElBQUksaUJBQWlCO1FBQ25CLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNqQyxDQUFDO0NBR0Y7QUFiRCx3QkFhQyJ9