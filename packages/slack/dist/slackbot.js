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
exports.Slackbot = void 0;
const lodash_1 = require("lodash");
const core_1 = require("@xene/core");
const middleware_1 = require("./middleware");
const is_mentioned_1 = require("./helpers/is-mentioned");
const channel_type_1 = require("./helpers/channel-type");
const api_1 = require("./api");
class Slackbot extends core_1.Bot {
    constructor(token) {
        super();
        this.token = token;
        // API Modules
        this.auth = new api_1.Auth(this.token);
        this.users = new api_1.Users(this.token);
        this.files = new api_1.Files(this.token);
        this.groups = new api_1.Groups(this.token);
        this.channels = new api_1.Channels(this.token);
        this.chat = new api_1.Chat(this.token);
        this.rtm = new api_1.RTM(this.token);
        this.selfIdentify();
        Slackbot.bots.push(this);
    }
    say(channel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const init = { text: '', attachments: [] };
            message = (0, lodash_1.isString)(message) ? Object.assign(Object.assign({}, init), { text: message }) : Object.assign(Object.assign({}, init), message);
            return this.chat.postMessage(channel, message);
        });
    }
    /**
     * Connect to Slack RTM API
     */
    listen() {
        this.rtm.on('message', this.onRtmMessage.bind(this));
        this.rtm.connect();
        return this;
    }
    /**
     * Process new incoming RTM messages
     */
    onRtmMessage(payload) {
        const { user, ts, text, channel } = payload;
        if (this.self.id === user)
            return;
        const isBotMentioned = (0, is_mentioned_1.isMentioned)(this.self.id, text);
        const isPrivate = (0, channel_type_1.isPrivateChannel)(channel);
        if (!isPrivate && !isBotMentioned)
            return;
        this.onMessage({ id: ts, text, user, channel });
    }
    selfIdentify() {
        return __awaiter(this, void 0, void 0, function* () {
            const { team, teamId, user, userId: id } = yield this.auth.test();
            this.self = { id, name: user, team: { id: teamId, title: team } };
        });
    }
}
exports.Slackbot = Slackbot;
Slackbot.Oauth = api_1.Oauth;
Slackbot.dispatch = (ctx) => {
    const { team, action, channel: { id: channel }, user: { id: user } } = ctx;
    const slackbot = Slackbot.bots.find(b => b.self.team.id === team.id);
    const selectedReplacer = `*:white_check_mark: ${action.value}*`;
    ctx.message.attachments.forEach(a => {
        if (!a.menus.some(m => m.id === action.id) &&
            !a.buttons.some(m => m.id === action.id))
            return;
        a.text = a.text ? `${a.text}\n${selectedReplacer}` : selectedReplacer;
        a.menus = [];
    });
    slackbot.onMessage({ id: Date.now().toString(), channel, text: action.value, user });
};
// tslint:disable-next-line:member-ordering
Slackbot.middleware = (0, middleware_1.middleware)(Slackbot.dispatch);
Slackbot.bots = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2tib3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2xhY2tib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlDO0FBQ2pDLHFDQUFnQztBQUVoQyw2Q0FBeUM7QUFDekMseURBQW9EO0FBQ3BELHlEQUF5RDtBQUd6RCwrQkFBOEU7QUFFOUUsTUFBYSxRQUFTLFNBQVEsVUFBcUI7SUFrQ2pELFlBQW9CLEtBQXdEO1FBQzFFLEtBQUssRUFBRSxDQUFBO1FBRFcsVUFBSyxHQUFMLEtBQUssQ0FBbUQ7UUFUNUUsY0FBYztRQUNkLFNBQUksR0FBRyxJQUFJLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0IsVUFBSyxHQUFHLElBQUksV0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUM3QixVQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzdCLFdBQU0sR0FBRyxJQUFJLFlBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDL0IsYUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUNuQyxTQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQzNCLFFBQUcsR0FBRyxJQUFJLFNBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFJdkIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzFCLENBQUM7SUFFSyxHQUFHLENBQUMsT0FBZSxFQUFFLE9BQXlCOztZQUNsRCxNQUFNLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxDQUFBO1lBQzFDLE9BQU8sR0FB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