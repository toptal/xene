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
            if (isDm) {
                const result = yield this.webClient.im.open(id);
                return result.channel.id;
            }
            if (isGroup) {
                const result = yield this.webClient.im.open(id);
                return result.channel.id;
            }
            // TODO fix this
            // if (channel) {
            //   console.log(this.rtmStore.getChannelOrGroupByName(channel))
            //   return this.rtmStore.getChannelOrGroupByName(channel) + '_'
            // }
            // const dm = this.rtmStore.getDMByName(user)
            // console.log(dm)
            // if (dm) {
            //   return dm.id + '_'
            // } else {
            //   const userId = this.rtmStore.getUserByName(user)
            //   const ret = await this.webClient.im.open(userId)
            //   console.log(ret)
            // }
            return '';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRhcHRlcnMvc2xhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6QyxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLHlCQUEyQixRQUMzQixDQUFDLENBRGtDO0FBQ25DLHlCQU1PLGVBRVAsQ0FBQyxDQUZxQjtBQU90QixNQUFNLFlBQVksR0FBRztJQUNuQixDQUFDLDZCQUFvQixDQUFDLFlBQVksQ0FBQyxFQUFFLFlBQVk7SUFDakQsQ0FBQyw2QkFBb0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxZQUFZO0NBQ2hELENBQUE7QUFFRCxNQUFZLFVBQVUsV0FBTSxzQkFFNUIsQ0FBQyxDQUZpRDtBQVVsRCwyQkFBMEMscUJBQVk7SUFTcEQsWUFBYSxLQUFhLEVBQUUsT0FBTyxHQUFxQyxFQUFFO1FBQ3hFLE9BQU8sQ0FBQTtRQUxULGlCQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQU1sQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVZLE9BQU8sQ0FBRSxFQUFVLEVBQUUsSUFBSSxHQUFXLFFBQVE7O1lBQ3ZELE1BQU0sU0FBUyxHQUFHLElBQUksSUFBSSxTQUFTLENBQUE7WUFDbkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLE9BQU8sQ0FBQTtZQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLElBQUksUUFBUSxDQUFBO1lBRTdCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ1QsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJ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