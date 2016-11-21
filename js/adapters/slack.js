"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
// import * as config from 'config'
// import {post} from 'lib/utils/request'
const _ = require('lodash');
const events_1 = require('events');
const client_1 = require('@slack/client');
const KNOWN_EVENTS = {
    [client_1.RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN]: 'slack.join',
    [client_1.RTM_MESSAGE_SUBTYPES.GROUP_JOIN]: 'slack.join'
};
const attachment = require('./helpers/attachment');
class SlackAdapter extends events_1.EventEmitter {
    constructor(token, options = {}) {
        super();
        this.messageChain = Promise.resolve(null);
        this.name = options.name;
        this.avatar = options.avatar;
        this.runClients(token);
    }
    getChat(id, type = 'direct') {
        return __awaiter(this, void 0, void 0, function* () {
            const isChannel = type == 'channel';
            const isGroup = type == 'group';
            const isDm = type == 'direct';
            // id is an id of existing channel, group or dm
            let chat = this.rtmStore.getChannelGroupOrDMById(id);
            if (chat)
                return chat.id;
            // id is a name of user
            if (isDm) {
                chat = this.rtmStore.getDMByName(id);
                if (chat)
                    return chat.id;
                try {
                    chat = yield this.webClient.im.open(id);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(e);
                }
            }
            // id is an name of existing channel or group
            chat = this.rtmStore.getChannelOrGroupByName(id);
            if (chat)
                return chat.id;
            if (isChannel) {
                try {
                    chat = yield this.webClient.channels.create(id);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(e);
                }
            }
            if (isGroup) {
                try {
                    chat = yield this.webClient.groups.create(id);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(e);
                }
            }
        });
    }
    runClients(slackToken) {
        const webClient = new client_1.WebClient(slackToken);
        const rtmClient = new client_1.RtmClient(slackToken, { logLevel: 'error' });
        rtmClient.on(client_1.CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.profile = d.self));
        rtmClient.on(client_1.RTM_EVENTS.MESSAGE, this.handleRtmMessage.bind(this));
        rtmClient.start();
        this.webClient = webClient;
        this.rtmClient = rtmClient;
        this.rtmStore = rtmClient.dataStore;
    }
    // static async oauthAccess (toptalToken, code) {
    //   const {id, secret, api} = config.slack
    //   const {url} = config.app
    //   return await post({
    //     uri: api + 'oauth.access',
    //     form: {
    //       redirect_uri: `${url}authorize?token=${toptalToken}`,
    //       client_secret: secret,
    //       client_id: id,
    //       code
    //     }
    //   })
    // }
    handleRtmMessage(payload) {
        if (!payload.user) {
            return;
        }
        const isSelf = this.profile.id === payload.user;
        const event = this.isEvent(payload.subtype);
        if (isSelf && event) {
            return this.emit(`message.${event}`, payload);
        }
        const message = {
            id: payload.ts,
            text: payload.text,
            user: payload.user,
            chat: payload.channel,
            type: this.chatType(payload.channel)
        };
        const isBotMentioned = this.isBotMentioned(payload.text);
        const isPrivate = Boolean(this.rtmStore.getDMById(payload.channel));
        if (!isSelf && (isPrivate || isBotMentioned)) {
            this.emit('message', message);
        }
    }
    chatType(str) {
        switch (str.substring(0, 1)) {
            case 'C': return 'channel';
            case 'G': return 'group';
            case 'D': return 'direct';
        }
    }
    isEvent(subtype) {
        return KNOWN_EVENTS[subtype];
    }
    isBotMentioned(text) {
        const idrx = new RegExp(this.profile.id, 'i');
        return idrx.test(text);
    }
    send(channel, message) {
        let { text, attachments } = message;
        attachments = attachment.format(attachments);
        const options = { as_user: true, attachments };
        const request = new Promise((resolve, reject) => {
            this.webClient.chat.postMessage(channel, text, options)
                .then(resolve).catch(reject);
        });
        this.messageChain.then(() => request);
        return request;
    }
    findUser(idOrTerm) {
        let user;
        if (_.isString(idOrTerm)) {
            user = this.rtmStore.getUserById(idOrTerm);
        }
        else if (idOrTerm.email) {
            user = this.rtmStore.getUserByEmail(idOrTerm.email);
        }
        else if (idOrTerm.handler) {
            user = this.rtmStore.getUserByName(idOrTerm.handler);
        }
        const firstName = user.profile.first_name || '';
        const lastName = user.profile.last_name || '';
        return {
            id: user.id,
            email: user.profile.email,
            handler: `<@${user.id}>`,
            fullName: `${firstName ? firstName + ' ' : ''}` + lastName,
            firstName,
            lastName
        };
    }
    getUser(id) {
        const user = this.rtmStore.getUserById(id);
        return {
            firstName: user.profile.first_name || `<@${id}>`,
            lastName: user.profile.last_name || '',
            handler: `<@${id}>`,
            team: user.team_id,
            name: user.name,
            id
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SlackAdapter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRhcHRlcnMvc2xhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6QyxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLHlCQUEyQixRQUMzQixDQUFDLENBRGtDO0FBQ25DLHlCQU1PLGVBRVAsQ0FBQyxDQUZxQjtBQU90QixNQUFNLFlBQVksR0FBRztJQUNuQixDQUFDLDZCQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLFlBQVk7SUFDakQsQ0FBQyw2QkFBb0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZO0NBQ2hELENBQUE7QUFFRCxNQUFZLFVBQVUsV0FBTSxzQkFFNUIsQ0FBQyxDQUZpRDtBQVVsRCwyQkFBMEMscUJBQVk7SUFTcEQsWUFBYSxLQUFhLEVBQUUsT0FBTyxHQUFxQyxFQUFFO1FBQ3hFLE9BQU8sQ0FBQTtRQUxULGlCQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQU1sQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVZLE9BQU8sQ0FBRSxFQUFVLEVBQUUsSUFBSSxHQUFXLFFBQVE7O1lBQ3ZELE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxTQUFTLENBQUE7WUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLE9BQU8sQ0FBQTtZQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxDQUFBO1lBRTdCLCtDQUErQztZQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEVBQUUs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