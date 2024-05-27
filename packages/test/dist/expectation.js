"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expectation = void 0;
const lodash_1 = require("lodash");
const resolvable_1 = require("./resolvable");
class Expectation {
    constructor(_context, _message, _channel = `C${Math.random().toString()}`, _user = `U${Math.random().toString()}`) {
        this._context = _context;
        this._message = _message;
        this._channel = _channel;
        this._user = _user;
    }
    says(message, channel) {
        const resolvable = new resolvable_1.Resolvable();
        const check = (c, m) => resolvable.resolve((0, lodash_1.isEqual)(c, channel || this._channel) && (0, lodash_1.isEqual)(m, message));
        this._context._add(check, this._message, this._channel, this._user);
        return resolvable.promise;
    }
}
exports.Expectation = Expectation;
Expectation.create = (context) => (message, ...args) => new Expectation(context, message, ...args);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwZWN0YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZXhwZWN0YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQXNDO0FBQ3RDLDZDQUF5QztBQU16QyxNQUFhLFdBQVc7SUFJdEIsWUFDVSxRQUFvQixFQUFVLFFBQWdCLEVBQzlDLFdBQW1CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQ2pELFFBQWdCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBRjlDLGFBQVEsR0FBUixRQUFRLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQzlDLGFBQVEsR0FBUixRQUFRLENBQXlDO1FBQ2pELFVBQUssR0FBTCxLQUFLLENBQXlDO0lBQ3BELENBQUM7SUFFTCxJQUFJLENBQUMsT0FBNkIsRUFBRSxPQUFnQjtRQUNsRCxNQUFNLFVBQVUsR0FBRyxJQUFJLHVCQUFVLEVBQVcsQ0FBQTtRQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBQSxnQkFBRSxFQUFDLENBQUMsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUEsZ0JBQUUsRUFBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUM3RixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuRSxPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUE7SUFDM0IsQ0FBQzs7QUFmSCxrQ0FnQkM7QUFmUSxrQkFBTSxHQUFHLENBQXNDLE9BQVUsRUFBUyxFQUFFLENBQ3pFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFdBQVcsQ0FBSSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUEifQ==