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
exports.express = exports.koa = void 0;
const qs = require("querystring");
const rawBody = require("raw-body");
const lodash_1 = require("lodash");
const case_1 = require("../helpers/case");
const format = require("../helpers/formatters/message");
const streamPayload = req => rawBody(req, { encoding: true }).then(qs.parse).then(i => JSON.parse(i.payload));
const existingPayload = payload => typeof payload === 'string' ? JSON.parse(payload) : payload;
const middlewareContext = (payload) => {
    const action = payload.actions[0];
    const { user, team, channel, token, callbackId, responseUrl } = payload;
    return {
        user, team, channel, token, callbackId, ephemeral: undefined, responseUrl,
        message: format.fromSlack(payload.originalMessage),
        action: {
            value: action.type === 'button' ? action.value : action.selectedOptions[0].value,
            type: action.type,
            id: action.name
        }
    };
};
const processRequestWithHandler = (handler, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const context = middlewareContext((0, case_1.camel)(payload));
    yield handler(context);
    let response;
    const { ephemeral, message } = context;
    const ephemeralAdded = ephemeral != null;
    const deleted = message == null;
    const modified = !deleted && !(0, lodash_1.isEqual)(message, format.fromSlack(payload.original_message));
    if (ephemeralAdded && modified)
        throw new Error("Can't show ephemeral message and update original message in the same time.");
    if (modified)
        response = format.toSlack(message);
    if (deleted)
        response = { delete_original: true };
    if (ephemeralAdded) {
        response = (0, lodash_1.isString)(ephemeral) ? { text: ephemeral } : format.toSlack(ephemeral);
        response.response_type = 'ephemeral';
        response.replace_original = false;
        response.delete_original = deleted;
    }
    if (!modified && !deleted && !ephemeralAdded)
        return;
    const body = response || payload.original_message;
    fetch(context.responseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
});
const koa = (handler, ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.method.toLowerCase() !== 'post')
        return;
    // ctx.request.body hack is to get parsed body
    // if any body parsers middleware is already used in code
    // tslint:disable
    const payload = existingPayload((0, lodash_1.get)(ctx, 'request.body.payload')) || (yield streamPayload(ctx.req));
    processRequestWithHandler(handler, payload);
    ctx.status = 200;
    ctx.body = '';
    return next();
});
exports.koa = koa;
const express = (handler, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method.toLowerCase() !== 'post')
        return;
    const payload = existingPayload((0, lodash_1.get)(req, 'body.payload')) || (yield streamPayload(req));
    processRequestWithHandler(handler, payload);
    res.status(200).end();
    return next();
});
exports.express = express;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZS9taWRkbGV3YXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFDQSxrQ0FBaUM7QUFFakMsb0NBQW1DO0FBQ25DLG1DQUErQztBQUUvQywwQ0FBdUM7QUFDdkMsd0RBQXVEO0FBR3ZELE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtBQUNsSCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFBO0FBRTlGLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxPQUFPLEVBQXFCLEVBQUU7SUFDdkQsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNqQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUE7SUFDdkUsT0FBTztRQUNMLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxXQUFXO1FBQ3pFLE9BQU8sRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7UUFDbEQsTUFBTSxFQUFFO1lB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