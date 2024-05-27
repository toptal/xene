"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const remove = (array, el) => {
    const index = array.indexOf(el);
    return index >= 0 ? array.splice(index, 1) : array;
};
class Channel {
    constructor() {
        this._managers = [];
        this._allManagers = [];
    }
    add(manager) {
        const canPrepare = manager.users.some(u => !this.hasFor(u));
        this._managers.push(manager);
        if (canPrepare)
            manager.prepare();
    }
    processMessage(message) {
        const manager = this._headFor(message.user);
        const canContinue = manager && manager.perform(message);
        if (canContinue)
            this._prepareNext(manager);
    }
    hasFor(user) {
        for (const { users } of this._managers)
            if (users.includes(user))
                return true;
        return false;
    }
    bind(manager) {
        this._allManagers.push(manager);
    }
    without(manager) {
        this._allManagers = this._allManagers.filter(m => m !== manager);
        this._managers = this._managers.filter(m => m !== manager);
    }
    abort(user) {
        const head = this._allManagers.find(m => m.users.includes(user));
        if (head)
            head.abort();
    }
    _prepareNext(manager) {
        const users = manager.users.reduce((acc, u) => this._headFor(u) === manager ? acc.concat(u) : acc, []);
        remove(this._managers, manager);
        users.forEach(u => this.hasFor(u) ? this._headFor(u).prepare() : null);
    }
    _headFor(user) {
        for (const manager of this._managers)
            if (manager.users.includes(user))
                return manager;
    }
}
exports.Channel = Channel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQVNBLE1BQU0sTUFBTSxHQUFHLENBQUksS0FBVSxFQUFFLEVBQUssRUFBTyxFQUFFO0lBQzNDLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDL0IsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO0FBQ3BELENBQUMsQ0FBQTtBQUVELE1BQWEsT0FBTztJQUFwQjtRQUNVLGNBQVMsR0FBZSxFQUFFLENBQUE7UUFDMUIsaUJBQVksR0FBZSxFQUFFLENBQUE7SUE4Q3ZDLENBQUM7SUE1Q0MsR0FBRyxDQUFDLE9BQWlCO1FBQ25CLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDM0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDNUIsSUFBSSxVQUFVO1lBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBQ25DLENBQUM7SUFFRCxjQUFjLENBQUMsT0FBb0I7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0MsTUFBTSxXQUFXLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDdkQsSUFBSSxXQUFXO1lBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQVk7UUFDakIsS0FBSyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVM7WUFDcEMsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQTtRQUN2QyxPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUM7SUFFRCxJQUFJLENBQUMsT0FBaUI7UUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDakMsQ0FBQztJQUVELE9BQU8sQ0FBQyxPQUFpQjtRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFBO1FBQ2hFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUE7SUFDNUQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFZO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNoRSxJQUFJLElBQUk7WUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDeEIsQ0FBQztJQUVPLFlBQVksQ0FBQyxPQUFpQjtRQUNwQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRXpELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN4RSxDQUFDO0lBRU8sUUFBUSxDQUFDLElBQVk7UUFDM0IsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUztZQUNsQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFBRSxPQUFPLE9BQU8sQ0FBQTtJQUNwRCxDQUFDO0NBQ0Y7QUFoREQsMEJBZ0RDIn0=