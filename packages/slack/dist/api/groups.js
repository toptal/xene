"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = void 0;
const base_1 = require("./base");
const get_1 = require("../helpers/get");
class Groups extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.info = (group) => this.request('info', { group }).then((0, get_1.get)('channel'));
        this.list = () => this.request('list').then((0, get_1.get)('groups'));
    }
}
exports.Groups = Groups;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS9ncm91cHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQWtDO0FBRWxDLHdDQUFvQztBQUVwQyxNQUFhLE1BQU8sU0FBUSxnQkFBUztJQUFyQzs7UUFDRSxTQUFJLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsU0FBRyxFQUFRLFNBQVMsQ0FBQyxDQUFDLENBQUE7UUFFN0QsU0FBSSxHQUFHLEdBQUcsRUFBRSxDQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEsU0FBRyxFQUFVLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDckQsQ0FBQztDQUFBO0FBTkQsd0JBTUMifQ==