"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const ee_1 = require("./ee");
const parse_1 = require("./actions/parse");
const pause_1 = require("./actions/pause");
const question_1 = require("./actions/question");
const isPause = (p) => p instanceof pause_1.Pause;
const isParse = (p) => p instanceof parse_1.Parse;
const isQuestion = (q) => q instanceof question_1.Question;
class Manager {
    constructor(_bot, _channelID, users) {
        this._bot = _bot;
        this._channelID = _channelID;
        this.users = users;
        /** @internal */
        this._ee = new ee_1.EventEmitter();
        this.emit = this._ee.emit;
        this.on = this._ee.on;
        this._queue = [];
        this._messages = [];
        this._channel.bind(this);
    }
    /**
     * For questions call to ask is required and so it
     * should be just added to the end of queue until
     * previous question/parsers finish.
     *
     * For Parser there no need to prepare it
     * and it's possible just to parse last message
     * since it may contain info parser tries to get
     * (unlike questions, which need to ask question
     * before parsing). So call to parse here will do
     * almost the same thing as in perform but without
     * triggering error hander of parser to not mess
     * up with queue. If it fails then same flow applied
     * as for question e.g. add to queue.
     */
    add(action) {
        if (isQuestion(action) || isPause(action)) {
            this._queue.push(action);
            return this._channel.add(this);
        }
        if (this._lastMessage && action.perform(this._lastMessage))
            return;
        else
            this._queue.push(action);
        if (!this._queue.some(isQuestion))
            this._channel.add(this);
    }
    prepare() {
        if (isQuestion(this._head))
            this._head.ask();
        else if (isPause(this._head))
            return;
        else
            this._head.failed(this._lastMessage);
    }
    perform(message) {
        this.emit('incomingMessage', message);
        this._messages.push(message);
        if (this._isEmpty)
            return true;
        if (!this._head.perform(message)) {
            this._head.failed(message);
            return false;
        }
        this._queue.shift();
        if (isQuestion(this._head))
            return true;
        else
            return this.perform(message);
    }
    unpause() {
        this._queue = this._queue.filter(p => !isPause(p));
    }
    abort() {
        this.emit('abort');
    }
    unbind() {
        this._channel.without(this);
    }
    get _lastMessage() { return this._messages[this._messages.length - 1]; }
    get _channel() { return this._bot._channelFor(this._channelID); }
    get _isEmpty() { return this._queue.length === 0; }
    get _head() { return this._queue[0]; }
}
exports.Manager = Manager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDZCQUFtQztBQUVuQywyQ0FBdUM7QUFDdkMsMkNBQXVDO0FBRXZDLGlEQUE2QztBQUU3QyxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBYyxFQUFFLENBQUMsQ0FBQyxZQUFZLGFBQUssQ0FBQTtBQUNyRCxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBYyxFQUFFLENBQUMsQ0FBQyxZQUFZLGFBQUssQ0FBQTtBQUNyRCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBaUIsRUFBRSxDQUFDLENBQUMsWUFBWSxtQkFBUSxDQUFBO0FBRTlELE1BQWEsT0FBTztJQVNsQixZQUNVLElBQVMsRUFDVCxVQUFrQixFQUNuQixLQUFlO1FBRmQsU0FBSSxHQUFKLElBQUksQ0FBSztRQUNULGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbkIsVUFBSyxHQUFMLEtBQUssQ0FBVTtRQVh4QixnQkFBZ0I7UUFDaEIsUUFBRyxHQUFHLElBQUksaUJBQVksRUFBRSxDQUFBO1FBQ3hCLFNBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUNwQixPQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUE7UUFFUixXQUFNLEdBQWEsRUFBRSxDQUFBO1FBQ3JCLGNBQVMsR0FBa0IsRUFBRSxDQUFBO1FBT25DLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILEdBQUcsQ0FBQyxNQUFjO1FBQ2hCLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZ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