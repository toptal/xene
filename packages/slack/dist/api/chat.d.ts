import { APIModule } from './base';
import { Message, MessageOptions } from '../types';
type ChannelTs = {
    channel: string;
    ts: string;
};
type EphemeralMessage = Message & {
    user: string;
};
export declare class Chat extends APIModule {
    protected get token(): string;
    delete: (channel: string, ts: string, options?: {
        asUser?: boolean;
    }) => Promise<ChannelTs>;
    meMessage: (channel: string, text: string) => Promise<ChannelTs>;
    postEphemeral: (channel: string, message: EphemeralMessage, options?: MessageOptions) => Promise<{
        messageTs: string;
    }>;
    postMessage: (channel: string, message: Message, options?: MessageOptions) => Promise<ChannelTs & {
        message: Message;
    }>;
    update: (channel: string, ts: string, message: Message) => Promise<any>;
}
export {};
