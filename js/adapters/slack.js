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
            // id is an id of user
            if (isDm) {
                try {
                    chat = yield this.webClient.im.open(id);
                    console.log(chat);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(e);
                }
            }
            // id is an name of existing channel or group
            if (isChannel) {
                chat = this.rtmStore.getChannelByName(id);
                if (chat) {
                    try {
                        yield this.webClient.channels.join(id);
                        return chat.id;
                    }
                    catch (e) {
                        throw new Error(`Can't join channel '${id}' — ${e.toString()}`);
                    }
                }
                try {
                    chat = yield this.webClient.channels.create(id);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(`Can't create channel '${id}' — ${e.toString()}`);
                }
            }
            if (isGroup) {
                chat = this.rtmStore.getGroupByName(id);
                if (chat)
                    return chat.id;
                try {
                    chat = yield this.webClient.groups.create(id);
                    return chat.id;
                }
                catch (e) {
                    throw new Error(`Can't create group '${id}' — ${e.toString()}`);
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
            fullName: firstName + `${lastName ? ' ' + lastName : ''}`,
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