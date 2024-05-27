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
exports.APIModule = void 0;
const lodash_1 = require("lodash");
const request_1 = require("./request");
const errors_1 = require("../../errors");
const case_1 = require("../../helpers/case");
const stringify = (object) => (0, lodash_1.mapValues)((0, case_1.snake)(object), v => (0, lodash_1.isObject)(v) ? JSON.stringify(v) : v);
const SLACK_API_URL = process.env.XENE_SLACK_API_URL || 'https://slack.com/api';
const URI = (ns, method) => `${SLACK_API_URL}/${ns}.${method}`;
class APIModule {
    get token() {
        if (typeof this.tokens === 'string')
            return this.tokens;
        return this.tokens.appToken || this.tokens.botToken;
    }
    constructor(tokens) {
        this.tokens = tokens;
        this.namespace = this.constructor.name.toLowerCase();
    }
    request(method, form = {}, retriable = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = URI(this.namespace, method);
            const response = yield (0, request_1.request)(uri, stringify(form), this.token, retriable);
            if (!response.ok)
                throw new errors_1.APIError(response.error);
            return (0, case_1.camel)(response);
        });
    }
}
exports.APIModule = APIModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpL2Jhc2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQTRDO0FBQzVDLHVDQUFtQztBQUNuQyx5Q0FBdUM7QUFDdkMsNkNBQWlEO0FBRWpELE1BQU0sU0FBUyxHQUFHLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FDbkMsSUFBQSxrQkFBUyxFQUFDLElBQUEsWUFBSyxFQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBQSxpQkFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUVwRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLHVCQUF1QixDQUFBO0FBQy9FLE1BQU0sR0FBRyxHQUFHLENBQUMsRUFBVSxFQUFFLE1BQWMsRUFBRSxFQUFFLENBQ3pDLEdBQUcsYUFBYSxJQUFJLEVBQUUsSUFBSSxNQUFNLEVBQUUsQ0FBQTtBQUVwQyxNQUFzQixTQUFTO0lBRzdCLElBQWMsS0FBSztRQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxRQUFRO1lBQUUsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDckQsQ0FBQztJQUVELFlBQXNCLE1BQXlEO1FBQXpELFdBQU0sR0FBTixNQUFNLENBQW1EO1FBQzdFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDdEQsQ0FBQztJQUVlLE9BQU8sQ0FBQyxNQUFjLEVBQUUsT0FBZSxFQUFFLEVBQUUsWUFBcUIsS0FBSzs7WUFDbkYsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUE7WUFDdkMsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGlCQUFPLEVBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksaUJBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDcEQsT0FBTyxJQUFBLFlBQUssRUFBQyxRQUFRLENBQUMsQ0FBQTtRQUN4QixDQUFDO0tBQUE7Q0FDRjtBQWxCRCw4QkFrQkMifQ==