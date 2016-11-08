"use strict";
const events_1 = require('events');
class SelfEmitter extends events_1.EventEmitter {
    constructor() {
        super();
        this.__selfBind();
    }
    __selfBind() {
        this._toBind.map(b => {
            this.on(b.event, b.method.bind(this));
        });
    }
    static on(event) {
        return (target, key, descriptor) => {
            const method = descriptor.value;
            target._toBind = (target._toBind || []).concat({ event, method });
            return descriptor;
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SelfEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZi1lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hlbHBlcnMvc2VsZi1lbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBMkIsUUFFM0IsQ0FBQyxDQUZrQztBQU9uQywwQkFBeUMscUJBQVk7SUFHbkQ7UUFDRSxPQUFPLENBQUE7UUFDUCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ3ZDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxDQUFFLEtBQWE7UUFDdEIsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQVcsRUFBRSxVQUE4QjtZQUN6RCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFBO1lBQy9CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBQ2pFLE1BQU0sQ0FBQyxVQUFVLENBQUE7UUFDbkIsQ0FBQyxDQUFBO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFyQkQ7NkJBcUJDLENBQUEifQ==