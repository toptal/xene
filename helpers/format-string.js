"use strict";
const _ = require('lodash');
const regex = /{([^{}]+?)}/g;
function format(string, obj) {
    const replacer = (matched, path) => _.get(obj, path.trim(), matched);
    return string.replace(regex, replacer);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = format;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2Zvcm1hdC1zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFBO0FBRTVCLGdCQUFnQyxNQUFjLEVBQUUsR0FBUTtJQUN0RCxNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3BFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUN4QyxDQUFDO0FBSEQ7d0JBR0MsQ0FBQSJ9