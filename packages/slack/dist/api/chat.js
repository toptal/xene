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
exports.Chat = void 0;
const base_1 = require("./base");
const message_1 = require("../helpers/formatters/message");
class Chat extends base_1.APIModule {
    constructor() {
        super(...arguments);
        this.delete = (channel, ts, options = {}) => this.request('delete', Object.assign({ channel, ts }, options));
        this.meMessage = (channel, text) => this.request('meMessage', { channel, text });
        this.postEphemeral = (channel, message, options = {}) => this.request('postEphemeral', Object.assign(Object.assign({ channel, asUser: true }, options), (0, message_1.toSlack)(message)));
        this.postMessage = (channel, message, options = {}) => this.request('postMessage', Object.assign(Object.assign({ channel, asUser: true }, options), (0, message_1.toSlack)(message)))
            .then((_a) => {
            var { message: m } = _a, rest = __rest(_a, ["message"]);
            return (Object.assign({ message: (0, message_1.fromSlack)(m) }, rest));
        });
        this.update = (channel, ts, message) => this.request('update', Object.assign({ channel, ts, asUser: true, parse: 'none' }, (0, message_1.toSlack)(message)));
    }
    get token() {
        if (typeof this.tokens === 'string')
            return this.tokens;
        return this.tokens.botToken || this.tokens.appToken;
    }
}
exports.Chat = Chat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcGkvY2hhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFrQztBQUdsQywyREFBa0U7QUFLbEUsTUFBYSxJQUFLLFNBQVEsZ0JBQVM7SUFBbkM7O1FBTUUsV0FBTSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQVUsRUFBRSxVQUFnQyxFQUFFLEVBQXNCLEVBQUUsQ0FDL0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLGtCQUFJLE9BQU8sRUFBRSxFQUFFLElBQUssT0FBTyxFQUFHLENBQUE7UUFFckQsY0FBUyxHQUFHLENBQUMsT0FBZSxFQUFFLElBQVksRUFBc0IsRUFBRSxDQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRTlDLGtCQUFhLEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBeUIsRUFBRSxVQUEwQixFQUFFLEVBQ3RELEVBQUUsQ0FDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLGdDQUFJLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxJQUFLLE9BQU8sR0FBSyxJQUFBLGlCQUFPLEVBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQTtRQUU3RixnQkFBVyxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQWdCLEVBQUUsVUFBMEIsRUFBRSxFQUNoQyxFQUFFLENBQzVDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxnQ0FBSSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksSUFBSyxPQUFPLEdBQUssSUFBQSxpQkFBTyxFQUFDLE9BQU8sQ0FBQyxFQUFHO2FBQ3BGLElBQUksQ0FBQyxDQUFDLEVBQXVCLEVBQUUsRUFBRTtnQkFBM0IsRUFBRSxPQUFPLEVBQUUsQ0FBQyxPQUFXLEVBQU4sSUFBSSxjQUFyQixXQUF1QixDQUFGO1lBQU8sT0FBQSxpQkFBRyxPQUFPLEVBQUUsSUFBQSxtQkFBUyxFQUFDLENBQUMsQ0FBQyxJQUFLLElBQUksRUFBRyxDQUFBO1NBQUEsQ0FBQyxDQUFBO1FBRTlFLFdBQU0sR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFVLEVBQUUsT0FBZ0IsRUFBRSxFQUFFLENBQ3pELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxrQkFBSSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sSUFBSyxJQUFBLGlCQUFPLEVBQUMsT0FBTyxDQUFDLEVBQUcsQ0FBQTtJQUM3RixDQUFDO0lBdEJDLElBQWMsS0FBSztRQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDckQsQ0FBQztDQW1CRjtBQXZCRCxvQkF1QkMifQ==