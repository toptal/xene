"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bots = void 0;
const base_1 = require("./base");
const get_1 = require("../helpers/get");
class Bots extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.info = (id) => this.request('info', { bot: id }).then((0, get_1.get)('bot'));
    }
}
exports.Bots = Bots;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvYm90cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBa0M7QUFDbEMsd0NBQW9DO0FBVXBDLE1BQWEsSUFBSyxTQUFRLGdCQUFTO0lBQW5DOztRQUNFLFNBQUksR0FBRyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSxTQUFHLEVBQU0sS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUNoRixDQUFDO0NBQUE7QUFGRCxvQkFFQyJ9