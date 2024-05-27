"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIError = exports.NotFound = exports.ClientError = void 0;
// tslint:disable:max-classes-per-file
const lodash_1 = require("lodash");
class ClientError extends Error {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'SlackbotApiError';
    }
}
exports.ClientError = ClientError;
class NotFound extends ClientError {
    constructor(type, args) {
        super(`${(0, lodash_1.capitalize)(type)} isn't found with params: ${JSON.stringify(args)}`);
    }
}
exports.NotFound = NotFound;
class APIError extends ClientError {
    constructor(message) {
        super(`Slack API returned error code ${message}.`);
    }
}
exports.APIError = APIError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBc0M7QUFDdEMsbUNBQW1DO0FBRW5DLE1BQWEsV0FBWSxTQUFRLEtBQUs7SUFDcEMsWUFBbUIsT0FBZTtRQUNoQyxLQUFLLEVBQUUsQ0FBQTtRQURVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFFaEMsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQTtJQUNoQyxDQUFDO0NBQ0Y7QUFMRCxrQ0FLQztBQUVELE1BQWEsUUFBUyxTQUFRLFdBQVc7SUFDdkMsWUFBWSxJQUFZLEVBQUUsSUFBUztRQUNqQyxLQUFLLENBQUMsR0FBRyxJQUFBLG1CQUFVLEVBQUMsSUFBSSxDQUFDLDZCQUE2QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0NBQ0Y7QUFKRCw0QkFJQztBQUVELE1BQWEsUUFBUyxTQUFRLFdBQVc7SUFDdkMsWUFBWSxPQUFlO1FBQ3pCLEtBQUssQ0FBQyxpQ0FBaUMsT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0NBQ0Y7QUFKRCw0QkFJQyJ9