/// <reference types="node" />
import { EventEmitter } from 'events';
import { RtmClient, WebClient } from '@slack/client';
import { default as BotMessage } from '../types/messages/bot';
import Adapter from '../types/adapter';
export default class SlackAdapter extends EventEmitter implements Adapter {
    profile: any;
    rtmStore: any;
    webClient: WebClient;
    rtmClient: RtmClient;
    messageChain: Promise<any>;
    name?: string;
    avatar?: string;
    constructor(token: string, options?: {
        name?: string;
        avatar?: string;
    });
    getChat(options: {
        channel?: string;
        user?: string;
    }): Promise<string>;
    private runClients(slackToken);
    private handleRtmMessage(payload);
    private isEvent(subtype);
    private isBotMentioned(text);
    sendMessage(message: BotMessage): void;
    getUser(id: any): {
        firstName: any;
        lastName: any;
        handler: string;
        team: any;
        name: any;
        id: any;
    };
}
