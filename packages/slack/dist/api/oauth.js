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
exports.Oauth = void 0;
const base_1 = require("./base");
const request_1 = require("./base/request");
const case_1 = require("../helpers/case");
const errors_1 = require("../errors");
class Oauth extends base_1.APIModule {
    static access(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `https://slack.com/api/oauth.access`;
            const form = {
                client_id: options.id,
                client_secret: options.secret,
                code: options.code,
                redirect_uri: options.redirectUri
            };
            const response = yield (0, request_1.request)(uri, form, options.secret);
            if (!response.ok)
                throw new errors_1.APIError(response.error);
            return (0, case_1.camel)(response);
        });
    }
}
exports.Oauth = Oauth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2F1dGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBpL29hdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFrQztBQUNsQyw0Q0FBd0M7QUFDeEMsMENBQXVDO0FBQ3ZDLHNDQUFvQztBQUVwQyxNQUFhLEtBQU0sU0FBUSxnQkFBUztJQUNsQyxNQUFNLENBQU8sTUFBTSxDQUFDLE9BQTJFOztZQUM3RixNQUFNLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQTtZQUNoRCxNQUFNLElBQUksR0FBRztnQkFDWCxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JCLGFBQWEsRUFBRSxPQUFPLENBQUMsTUFBTTtnQkFDN0IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixZQUFZLEVBQUUsT0FBTyxDQUFDLFdBQVc7YUFDbEMsQ0FBQTtZQUNELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksaUJBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxJQUFBLFlBQUssRUFBQyxRQUFRLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQUE7Q0FDRjtBQWJELHNCQWFDIn0=