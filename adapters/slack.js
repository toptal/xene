"use strict";
// import * as config from 'config'
// import {post} from 'lib/utils/request'
const events_1 = require('events');
const client_1 = require('@slack/client');
const KNOWN_EVENTS = {
    [client_1.RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN]: 'slack.join',
    [client_1.RTM_MESSAGE_SUBTYPES.GROUP_JOIN]: 'slack.join'
};
const attachment = require('./helpers/attachment');
const SEPARATOR = '_';
class SlackAdapter extends events_1.EventEmitter {
    constructor(token, options = {}) {
        super();
        this.messageChain = Promise.resolve(null);
        this.name = options.name;
        this.avatar = options.avatar;
        this.runClients(token);
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
            chat: payload.channel + SEPARATOR + payload.user
        };
        const isBotMentioned = this.isBotMentioned(payload.text);
        const isPrivate = Boolean(this.rtmStore.getDMById(payload.channel));
        if (isPrivate || isBotMentioned) {
            this.emit('message', message);
        }
    }
    isEvent(subtype) {
        return KNOWN_EVENTS[subtype];
    }
    isBotMentioned(text) {
        const idrx = new RegExp(this.profile.id, 'i');
        return idrx.test(text);
    }
    sendMessage(message) {
        const { chat, text } = message;
        const attachments = attachment.format(message.attachments);
        const channel = chat.split(SEPARATOR)[0];
        const options = {
            username: this.name,
            icon_url: this.avatar,
            attachments
        };
        this.messageChain.then(() => {
            return new Promise((resolve, reject) => {
                this.webClient.chat.postMessage(channel, text, options)
                    .then(resolve).catch(reject);
            });
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRhcHRlcnMvc2xhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMseUJBQTJCLFFBQzNCLENBQUMsQ0FEa0M7QUFDbkMseUJBTU8sZUFFUCxDQUFDLENBRnFCO0FBTXRCLE1BQU0sWUFBWSxHQUFHO0lBQ25CLENBQUMsNkJBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsWUFBWTtJQUNqRCxDQUFDLDZCQUFvQixDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVk7Q0FDaEQsQ0FBQTtBQUVELE1BQVksVUFBVSxXQUFNLHNCQUU1QixDQUFDLENBRmlEO0FBVWxELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQTtBQUVyQiwyQkFBMEMscUJBQVk7SUFTcEQsWUFBYSxLQUFhLEVBQUUsT0FBTyxHQUFxQyxFQUFFO1FBQ3hFLE9BQU8sQ0FBQTtRQUxULGlCQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQU1sQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVPLFVBQVUsQ0FBRSxVQUFrQjtRQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLGtCQUFTLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQkFBUyxDQUFDLFVBQVUsRUFBRSxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFBO1FBQ2hFLFNBQVMsQ0FBQyxFQUFFLENBQUMsc0JBQWEsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FB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