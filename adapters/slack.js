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
    sendMessage(channel, message) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRhcHRlcnMvc2xhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6Qyx5QkFBMkIsUUFDM0IsQ0FBQyxDQURrQztBQUNuQyx5QkFNTyxlQUVQLENBQUMsQ0FGcUI7QUFNdEIsTUFBTSxZQUFZLEdBQUc7SUFDbkIsQ0FBQyw2QkFBb0IsQ0FBQyxZQUFZLENBQUMsRUFBRSxZQUFZO0lBQ2pELENBQUMsNkJBQW9CLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWTtDQUNoRCxDQUFBO0FBRUQsTUFBWSxVQUFVLFdBQU0sc0JBRTVCLENBQUMsQ0FGaUQ7QUFVbEQsMkJBQTBDLHFCQUFZO0lBU3BELFlBQWEsS0FBYSxFQUFFLE9BQU8sR0FBcUMsRUFBRTtRQUN4RSxPQUFPLENBQUE7UUFMVCxpQkFBWSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFNbEMsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQTtRQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFFWSxPQUFPLENBQUUsRUFBVSxFQUFFLElBQUksR0FBVyxRQUFROztZQUN2RCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksU0FBUyxDQUFBO1lBQ25DLE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxPQUFPLENBQUE7WUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLFFBQVEsQ0FBQTtZQUU3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVB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