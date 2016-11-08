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
    constructor(token) {
        super();
        this.messageChain = Promise.resolve(null);
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
        this.messageChain.then(() => {
            return new Promise((resolve, reject) => {
                this.webClient.chat.postMessage(channel, text, { attachments })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWRhcHRlcnMvc2xhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMseUJBQTJCLFFBQzNCLENBQUMsQ0FEa0M7QUFDbkMseUJBTU8sZUFFUCxDQUFDLENBRnFCO0FBTXRCLE1BQU0sWUFBWSxHQUFHO0lBQ25CLENBQUMsNkJBQW9CLENBQUMsWUFBWSxDQUFDLEVBQUUsWUFBWTtJQUNqRCxDQUFDLDZCQUFvQixDQUFDLFVBQVUsQ0FBQyxFQUFFLFlBQVk7Q0FDaEQsQ0FBQTtBQUVELE1BQVksVUFBVSxXQUFNLHNCQUU1QixDQUFDLENBRmlEO0FBVWxELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQTtBQUVyQiwyQkFBMEMscUJBQVk7SUFPcEQsWUFBYSxLQUFhO1FBQ3hCLE9BQU8sQ0FBQTtRQUhULGlCQUFZLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUlsQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFFTyxVQUFVLENBQUUsVUFBa0I7UUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sU0FBUyxHQUFHLElBQUksa0JBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTtRQUNoRSxTQUFTLENBQUMsRUFBRSxDQUFDLHNCQUFhLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQzNFLFNBQVMsQ0FBQyxFQUFFLENBQUMsbUJBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtRQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQTtRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUE7SUFDckMsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCwyQ0FBMkM7SUFDM0MsNkJBQTZCO0lBQzdCLHdCQUF3QjtJQUN4QixpQ0FBaUM7SUFDakMsY0FBYztJQUNkLDhEQUE4RDtJQUM5RCwrQkFBK0I7SUFDL0IsdUJBQXVCO0lBQ3ZCLGFBQWE7SUFDYixRQUFRO0lBQ1IsT0FBTztJQUNQLElBQUk7SUFFSyxnQkFBZ0IsQ0FBRSxPQUFxQjtRQUM5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sQ0FBQTtRQUNSLENBQUM7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFBO1FBQy9DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRTNDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDL0MsQ0FBQztRQUVELE1BQU0sT0FBTyxHQUFnQjtZQUMzQixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7WUFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7WUFDbEIsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsT0FBTyxHQUFHLFNBQVMsR0FBRyxPQUFPLENBQUMsSUFBSTtTQUNqRCxDQUFBO1FBRUQsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDeEQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBRW5FLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQy9CLENBQUM7SUFDSCxDQUFDO0lBRU8sT0FBTyxDQUFFLE9BQWU7UUFDOUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBRU8sY0FBYyxDQUFFLElBQVk7UUFDbEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDeEIsQ0FBQztJQUVNLFdBQVcsQ0FBRSxPQUFtQjtRQUNyQyxNQUFNLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxHQUFHLE9BQU8sQ0FBQTtRQUM1QixNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtRQUMxRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO2dCQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDO3FCQUM1RCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2hDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sT0FBTyxDQUFFLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDMUMsTUFBTSxDQUFDO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEtBQUssRUFBRSxHQUFHO1lBQ2hELFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxFQUFFO1lBQ3RDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRztZQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsRUFBRTtTQUNILENBQUE7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQWhHRDs4QkFnR0MsQ0FBQSJ9