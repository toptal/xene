"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const base_1 = require("./base");
const get_1 = require("../helpers/get");
class Files extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.upload = (options) => this.request('upload', options).then((0, get_1.get)('file'));
        this.sharedPublicURL = (options) => this.request('sharedPublicURL', options).then((0, get_1.get)('file'));
    }
}
exports.Files = Files;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL2ZpbGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFrQztBQUNsQyx3Q0FBb0M7QUFHcEMsTUFBYSxLQUFNLFNBQVEsZ0JBQVM7SUFBcEM7O1FBQ0UsV0FBTSxHQUFHLENBQUMsT0FBbUMsRUFBRSxFQUFFLENBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLFNBQUcsRUFBTyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBRXpELG9CQUFlLEdBQUcsQ0FBQyxPQUF5QixFQUFFLEVBQUUsQ0FDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxTQUFHLEVBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQTtJQUNwRSxDQUFDO0NBQUE7QUFORCxzQkFNQyJ9