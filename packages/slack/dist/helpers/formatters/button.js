"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSlack = exports.toSlack = void 0;
const toSlack = (b) => ({
    style: b.type || 'default',
    confirm: b.confirm,
    value: b.value,
    type: 'button',
    text: b.label,
    name: b.id
});
exports.toSlack = toSlack;
const fromSlack = (b) => ({
    type: b.style || 'default',
    confirm: b.confirm,
    value: b.value,
    label: b.text,
    id: b.name
});
exports.fromSlack = fromSlack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2hlbHBlcnMvZm9ybWF0dGVycy9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDdEMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksU0FBUztJQUMxQixPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87SUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO0lBQ2QsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUs7SUFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7Q0FDWCxDQUFDLENBQUE7QUFQVyxRQUFBLE9BQU8sV0FPbEI7QUFFSyxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBVyxFQUFFLENBQUMsQ0FBQztJQUN4QyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxTQUFTO0lBQzFCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztJQUNsQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7SUFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUk7SUFDYixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUk7Q0FDWCxDQUFDLENBQUE7QUFOVyxRQUFBLFNBQVMsYUFNcEIifQ==