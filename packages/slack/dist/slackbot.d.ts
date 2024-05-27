import { Bot } from '@xene/core';
import { Message, MiddlewareContext } from './types';
import { Oauth, Auth, RTM, Chat, Users, Groups, Channels, Files } from './api';
export declare class Slackbot extends Bot<string | Message> {
    private token;
    static Oauth: typeof Oauth;
    static dispatch: (ctx: MiddlewareContext) => void;
    static middleware: (...args: any[]) => Promise<any>;
    private static bots;
    self: {
        id: string;
        name: string;
        team: {
            id: string;
            title: string;
        };
    };
    auth: Auth;
    users: Users;
    files: Files;
    groups: Groups;
    channels: Channels;
    chat: Chat;
    rtm: RTM;
    constructor(token: string | {
        appToken?: string;
        botToken?: string;
    });
    say(channel: string, message: string | Message): Promise<{
        channel: string;
        ts: string;
    } & {
        message: Message;
    }>;
    /**
     * Connect to Slack RTM API
     */
    listen(): this;
    /**
     * Process new incoming RTM messages
     */
    private onRtmMessage;
    private selfIdentify;
}
