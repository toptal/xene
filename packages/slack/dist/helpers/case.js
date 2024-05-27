"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snake = exports.camel = void 0;
const lodash_1 = require("lodash");
const transformer = f => (acc, value, key) => {
    if ((0, lodash_1.isArray)(value))
        value = value.map(traverse(f));
    else if ((0, lodash_1.isObject)(value))
        value = (0, lodash_1.reduce)(value, transformer(f), {});
    acc[f(key)] = value;
    return acc;
};
const traverse = f => value => {
    if ((0, lodash_1.isArray)(value))
        return value.map(traverse(f));
    if ((0, lodash_1.isObject)(value))
        return (0, lodash_1.reduce)(value, transformer(f), {});
    return value;
};
exports.camel = traverse(lodash_1.camelCase);
exports.snake = traverse(lodash_1.snakeCase);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2Nhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQXdFO0FBRXhFLE1BQU0sV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO0lBQzNDLElBQUksSUFBQSxnQkFBTyxFQUFDLEtBQUssQ0FBQztRQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQzdDLElBQUksSUFBQSxpQkFBUSxFQUFDLEtBQUssQ0FBQztRQUFFLEtBQUssR0FBRyxJQUFBLGVBQU0sRUFBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQ25FLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUE7SUFDbkIsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDLENBQUE7QUFFRCxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQzVCLElBQUksSUFBQSxnQkFBTyxFQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqRCxJQUFJLElBQUEsaUJBQVEsRUFBQyxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUEsZUFBTSxFQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDN0QsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDLENBQUE7QUFFWSxRQUFBLEtBQUssR0FBRyxRQUFRLENBQUMsa0JBQVMsQ0FBQyxDQUFBO0FBQzNCLFFBQUEsS0FBSyxHQUFHLFFBQVEsQ0FBQyxrQkFBUyxDQUFDLENBQUEifQ==