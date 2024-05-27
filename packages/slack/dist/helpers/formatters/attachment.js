"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSlack = exports.toSlack = void 0;
const buttonFormat = require("./button");
const menuFormat = require("./menu");
const toSlack = (_a) => {
    var { buttons, menus } = _a, rest = __rest(_a, ["buttons", "menus"]);
    const slackButtons = (buttons || []).map(buttonFormat.toSlack);
    const slackMenus = (menus || []).map(menuFormat.toSlack);
    return Object.assign({ actions: slackButtons.concat(slackMenus), text: '' }, rest);
};
exports.toSlack = toSlack;
const fromSlack = (_a) => {
    var { actions } = _a, rest = __rest(_a, ["actions"]);
    return (Object.assign({ buttons: (actions || []).filter(a => a.type === 'button').map(buttonFormat.fromSlack), menus: (actions || []).filter(a => a.type === 'menu').map(menuFormat.fromSlack) }, rest));
};
exports.fromSlack = fromSlack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0YWNobWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2Zvcm1hdHRlcnMvYXR0YWNobWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLHlDQUF3QztBQUN4QyxxQ0FBb0M7QUFFN0IsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUF1QyxFQUFFLEVBQUU7UUFBM0MsRUFBRSxPQUFPLEVBQUUsS0FBSyxPQUF1QixFQUFsQixJQUFJLGNBQXpCLG9CQUEyQixDQUFGO0lBQy9DLE1BQU0sWUFBWSxHQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDbkUsTUFBTSxVQUFVLEdBQVEsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM3RCx1QkFBUyxPQUFPLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFLLElBQUksRUFBRTtBQUN4RSxDQUFDLENBQUE7QUFKWSxRQUFBLE9BQU8sV0FJbkI7QUFFTSxNQUFNLFNBQVMsR0FBRyxDQUFDLEVBQW9CLEVBQWMsRUFBRTtRQUFwQyxFQUFFLE9BQU8sT0FBVyxFQUFOLElBQUksY0FBbEIsV0FBb0IsQ0FBRjtJQUFtQixPQUFBLGlCQUM3RCxPQUFPLEVBQUUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUNyRixLQUFLLEVBQUUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUM1RSxJQUFJLEVBQ1AsQ0FBQTtDQUFBLENBQUE7QUFKVyxRQUFBLFNBQVMsYUFJcEIifQ==