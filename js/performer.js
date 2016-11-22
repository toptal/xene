"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const _ = require('lodash');
const format_message_1 = require('./helpers/format-message');
class QueryError extends Error {
}
class Performer {
    constructor(scenario, user, chat) {
        this.chat = chat;
        this.state = {};
        this.setScenario(scenario);
        this.loadUsers(user);
    }
    input(text) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.query.handle(this.state, this.chat.bot, text);
            }
            catch (error) {
                // if something gone wrong inside of user defined query
                // it's better to return control to user
                throw new QueryError(error);
            }
            this.trySendMessage(result.message);
            if (!result.done)
                return false;
            if (!result.exit)
                this.setNextQuery(result.nextStep);
            this.trySaveState(result.storeAs, result.value);
            if (result.exit && !result.nextTopic)
                return true;
            this.tryReplaceScenario(result.nextTopic);
            return yield this.input(text);
        });
    }
    setScenario(scenario) {
        this.queries = scenario.queries.map(q => q());
        this.query = _.head(this.queries);
    }
    tryReplaceScenario(scenarioTitle) {
        if (!scenarioTitle)
            return;
        const scenario = this.chat.bot.getScenario(scenarioTitle);
        this.setScenario(scenario);
    }
    trySaveState(key, value) {
        if (!key || !value)
            return;
        this.state[key] = value;
    }
    setNextQuery(key) {
        let index = this.queries.indexOf(this.query) + 1;
        if (key)
            index = _.findIndex(this.queries, ['step', key]);
        this.query = this.queries[index];
    }
    loadUsers(user) {
        if (!_.isString(user))
            this.users = _.mapValues(user, id => this.chat.bot.user(id));
        else
            this.user = this.chat.bot.user(user);
    }
    trySendMessage(partialMessage) {
        if (!partialMessage)
            return;
        const formatOptions = _.cloneDeep(this.state);
        if (this.user)
            formatOptions.user = this.user;
        if (this.users)
            formatOptions.users = this.users;
        const message = format_message_1.default(partialMessage, formatOptions);
        this.chat.send(message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Performer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZm9ybWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BlcmZvcm1lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBUTNCLGlDQUEwQiwwQkFFMUIsQ0FBQyxDQUZtRDtBQUVwRCx5QkFBeUIsS0FBSztBQUFFLENBQUM7QUFFakM7SUFPRSxZQUNFLFFBQWtCLEVBQ2xCLElBQXVDLEVBQy9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBUFosVUFBSyxHQUFXLEVBQUUsQ0FBQTtRQVN4QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVZLEtBQUssQ0FBRSxJQUFhOztZQUMvQixJQUFJLE1BQU0sQ0FBQTtZQUNWLElBQUksQ0FBQztnQkFDSCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ25FLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNmLHVEQUF1RDtnQkFDdkQsd0NBQXdDO2dCQUN4QyxNQUFNLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQzdCLENBQUM7WUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUVuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtZQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxN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