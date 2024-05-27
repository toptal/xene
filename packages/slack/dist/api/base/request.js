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
exports.request = void 0;
const async = require("async");
const logger_1 = require("../../logger");
const util_1 = require("util");
const DEFAULT_RETRY_DELAY_MS = 10 * 1000; // 10 seconds
const REQUEST_TIMEOUT = Number(process.env.XENE_REQUEST_TIMEOUT) || 0;
const RETRIABLE_CODES = ['ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EHOSTUNREACH', 'ECONNREFUSED'];
const worker = (task, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.log(logger_1.requestToLogLevel, `Slack API request to: ${task.uri}`);
        const result = yield postWithTimeout(task);
        task.resolve(result);
    }
    catch (error) {
        if (error.statusCode == 429) {
            const delayMs = (Number(error.response.headers['retry-after']) * 1000) || DEFAULT_RETRY_DELAY_MS;
            logger_1.logger.info((0, util_1.format)('Slack API rate limited for %sms', delayMs));
            retryRequest(task, delayMs);
        }
        else if (task.retriable && error.cause && RETRIABLE_CODES.includes(error.cause.code)) {
            const delayMs = DEFAULT_RETRY_DELAY_MS;
            logger_1.logger.info((0, util_1.format)('Slack API timeout: %s. Retrying in %sms', error.cause.code, delayMs));
            retryRequest(task, delayMs);
        }
        else {
            logger_1.logger.error(error);
            logger_1.logger.error((0, util_1.format)('Slack API request errored with status %s, timeout: %s, code: %s', error.statusCode, error.timeout, error.code));
            task.reject(error);
        }
    }
    done();
});
const postWithTimeout = (task) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    const promise = fetch(task.uri, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${task.token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: task.form,
        signal: controller.signal
    });
    return promise
        .then(res => res.json())
        .finally(() => clearTimeout(timeout));
};
const retryRequest = (task, delayMs) => {
    setTimeout(queue.resume, delayMs);
    queue.unshift(task);
    queue.pause();
};
const queue = async.queue(worker, 3);
const request = (uri, form, token, retriable = false) => new Promise((resolve, reject) => queue.push({ uri, form, token, retriable, resolve, reject }));
exports.request = request;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGkvYmFzZS9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtCQUE4QjtBQUM5Qix5Q0FBd0Q7QUFDeEQsK0JBQTZCO0FBSTdCLE1BQU0sc0JBQXNCLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQSxDQUFDLGFBQWE7QUFDdEQsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckUsTUFBTSxlQUFlLEdBQUcsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0FBRXhGLE1BQU0sTUFBTSxHQUFHLENBQU8sSUFBVSxFQUFFLElBQUksRUFBRSxFQUFFO0lBQ3hDLElBQUk7UUFDRixlQUFNLENBQUMsR0FBRyxDQUFDLDBCQUFpQixFQUFFLHlCQUF5QixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUNsRSxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3JCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO1lBQzNCLE1BQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksc0JBQXNCLENBQUE7WUFDaEcsZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFBLGFBQU0sRUFBQyxpQ0FBaUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO1lBRS9ELFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7U0FDNUI7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