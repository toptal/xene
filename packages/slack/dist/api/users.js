"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const base_1 = require("./base");
const get_1 = require("../helpers/get");
class Users extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.info = (user) => this.request('info', { user }).then((0, get_1.get)('user'));
        this.list = () => this.request('list').then((0, get_1.get)('members'));
        this.lookupByEmail = (email) => this.request('lookupByEmail', { email }).then((0, get_1.get)('user'));
    }
}
exports.Users = Users;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL3VzZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFrQztBQUVsQyx3Q0FBb0M7QUFFcEMsTUFBYSxLQUFNLFNBQVEsZ0JBQVM7SUFBcEM7O1FBQ0UsU0FBSSxHQUFHLENBQUMsSUFBWSxFQUFFLEVBQUUsQ0FDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLFNBQUcsRUFBTyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBRXhELFNBQUksR0FBRyxHQUFHLEVBQUUsQ0FDVixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLFNBQUcsRUFBUyxTQUFTLENBQUMsQ0FBQyxDQUFBO1FBRW5ELGtCQUFhLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsU0FBRyxFQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUE7SUFDcEUsQ0FBQztDQUFBO0FBVEQsc0JBU0MifQ==