"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RTM = void 0;
const WebSocket = require("ws");
const eventemitter3_1 = require("eventemitter3");
const base_1 = require("../base");
const logger_1 = require("../../logger");
const util_1 = require("util");
const PING_INTERVAL = 5000;
const MAX_PONG_INTERVAL = 20000;
const boundPromise = () => {
    const result = {};
    result.promise = new Promise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
};
class RTM extends base_1.APIModule {
    get token() {
        if (typeof this.tokens === 'string')
            return this.tokens;
        return this.tokens.botToken || this.tokens.appToken;
    }
    constructor(token) {
        super(token);
        this.inc = 1;
        this.ee = new eventemitter3_1.EventEmitter();
        this.lastPong = 0;
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            const promise = boundPromise();
            const response = yield this.request('connect', {}, true); // Retry in case of timeout
            this.ws = new WebSocket(response.url);
            logger_1.logger.verbose(`Configuring WebSocket connection to ${response.url}`);
            this.ws.on('message', this.emit.bind(this));
            this.ws.on('close', this.reconnect.bind(this));
            this.ws.on('open', () => promise.resolve(response));
            return promise.promise;
        });
        this.on = this.ee.addListener.bind(this.ee);
        this.off = this.ee.removeListener.bind(this.ee);
    }
    typing(channel) {
        this.wsSend({ type: 'typing', channel });
    }
    emit(msgString) {
        const msg = JSON.parse(msgString);
        if (msg.type === 'hello')
            this.handleHello();
        if (msg.type === 'pong')
            this.lastPong = Date.now();
        logger_1.logger.verbose(`Incoming RTM message ${msg.type}`);
        this.ee.emit(msg.subtype ? `${msg.type}.${msg.subtype}` : msg.type, msg);
    }
    handleHello() {
        this.lastPong = Date.now();
        if (this.pingTimer)
            clearInterval(this.pingTimer);
        this.pingTimer = setInterval(this.pingServer.bind(this), PING_INTERVAL);
    }
    reconnect() {
        logger_1.logger.verbose('Reconnecting to RTM API');
        this.disconnect();
        this.connect();
    }
    disconnect() {
        clearInterval(this.pingTimer);
        this.pingTimer = undefined;
        if (!this.ws)
            return;
        this.ws.removeAllListeners('close');
        this.ws.close();
    }
    pingServer() {
        const pongInterval = Math.abs(Date.now() - this.lastPong - PING_INTERVAL);
        if (pongInterval > MAX_PONG_INTERVAL)
            return this.reconnect();
        this.wsSend({ type: 'ping' });
    }
    wsSend(message) {
        logger_1.logger.verbose((0, util_1.format)('Sending a message: %s', message));
        this.ws.send(JSON.stringify(Object.assign(Object.assign({}, message), { id: this.inc })));
        this.inc += 1;
    }
}
exports.RTM = RTM;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL3J0bS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxnQ0FBK0I7QUFDL0IsaURBQTRDO0FBRTVDLGtDQUFtQztBQUNuQyx5Q0FBcUM7QUFFckMsK0JBQTZCO0FBRTdCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQTtBQUMxQixNQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQTtBQUUvQixNQUFNLFlBQVksR0FBRyxHQUE4RSxFQUFFO0lBQ25HLE1BQU0sTUFBTSxHQUFHLEVBQVMsQ0FBQTtJQUN4QixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQy9DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0lBQ3hCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxNQUFNLENBQUE7QUFDZixDQUFDLENBQUE7QUFFRCxNQUFhLEdBQUksU0FBUSxnQkFBUztJQVNoQyxJQUFjLEtBQUs7UUFDakIsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUTtZQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUN2RCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO0lBQ3JELENBQUM7SUFFRCxZQUFZLEtBQUs7UUFDZixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7UUFaTixRQUFHLEdBQVcsQ0FBQyxDQUFBO1FBRWYsT0FBRSxHQUFHLElBQUksNEJBQVksRUFBRSxDQUFBO1FBRXZCLGFBQVEsR0FBRyxDQUFDLENBQUE7UUFhcEIsWUFBTyxHQUFHLEdBQVMsRUFBRTtZQUNuQixNQUFNLE9BQU8sR0FBRyxZQUFZLEVBQUUs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