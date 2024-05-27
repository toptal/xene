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
const attachmentFormat = require("./attachment");
const case_1 = require("../case");
const toSlack = (_a) => {
    var { attachments } = _a, rest = __rest(_a, ["attachments"]);
    return (0, case_1.snake)(Object.assign({ attachments: (attachments || []).map(attachmentFormat.toSlack) }, rest));
};
exports.toSlack = toSlack;
const fromSlack = (message) => {
    const _a = (0, case_1.camel)(message), { attachments } = _a, rest = __rest(_a, ["attachments"]);
    return Object.assign({ attachments: (attachments || []).map(attachmentFormat.fromSlack) }, rest);
};
exports.fromSlack = fromSlack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2Zvcm1hdHRlcnMvbWVzc2FnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLGlEQUFnRDtBQUNoRCxrQ0FBc0M7QUFFL0IsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFpQyxFQUFFLEVBQUU7UUFBckMsRUFBRSxXQUFXLE9BQW9CLEVBQWYsSUFBSSxjQUF0QixlQUF3QixDQUFGO0lBQzVDLE9BQUEsSUFBQSxZQUFLLGtCQUFHLFdBQVcsRUFBRSxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUssSUFBSSxFQUFHLENBQUE7Q0FBQSxDQUFBO0FBRHZFLFFBQUEsT0FBTyxXQUNnRTtBQUU3RSxNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQU8sRUFBVyxFQUFFO0lBQzVDLE1BQU0sS0FBMkIsSUFBQSxZQUFLLEVBQUMsT0FBTyxDQUFDLEVBQXpDLEVBQUUsV0FBVyxPQUE0QixFQUF2QixJQUFJLGNBQXRCLGVBQXdCLENBQWlCLENBQUE7SUFDL0MsdUJBQVMsV0FBVyxFQUFFLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSyxJQUFJLEVBQUU7QUFDdEYsQ0FBQyxDQUFBO0FBSFksUUFBQSxTQUFTLGFBR3JCIn0=