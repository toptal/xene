"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this._subscribers = new Map();
        this.on = (event, cb) => {
            const existing = this._subscribers.get(event) || [];
            existing.push(cb);
            this._subscribers.set(event, existing);
        };
        this.emit = (event, ...args) => {
            const existing = this._subscribers.get(event) || [];
            existing.forEach(cb => cb(...args));
        };
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsTUFBYSxZQUFZO0lBQXpCO1FBQ1UsaUJBQVksR0FBRyxJQUFJLEdBQUcsRUFBZ0IsQ0FBQTtRQUM5QyxPQUFFLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBTSxFQUFFLEVBQUU7WUFDN0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ25ELFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDakIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFBO1FBQ3hDLENBQUMsQ0FBQTtRQUVELFNBQUksR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLElBQVcsRUFBRSxFQUFFO1lBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUNuRCxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNyQyxDQUFDLENBQUE7SUFDSCxDQUFDO0NBQUE7QUFaRCxvQ0FZQyJ9