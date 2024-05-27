"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const base_1 = require("./base");
class Auth extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.test = () => this.request('test');
        this.revoke = (test = false) => this.request('revoke', { test });
    }
    get token() {
        if (typeof this.tokens === 'string')
            return this.tokens;
        return this.tokens.botToken || this.tokens.appToken;
    }
}
exports.Auth = Auth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBa0M7QUFVbEMsTUFBYSxJQUFLLFNBQVEsZ0JBQVM7SUFBbkM7O1FBTUUsU0FBSSxHQUFHLEdBQXNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXBELFdBQU0sR0FBRyxDQUFDLE9BQWdCLEtBQUssRUFBaUMsRUFBRSxDQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQVRDLElBQWMsS0FBSztRQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDckQsQ0FBQztDQU1GO0FBVkQsb0JBVUMifQ==