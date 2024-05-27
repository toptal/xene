import { Channel } from '../types';
import { APIModule } from './base';
export type Message = {
    type: string;
    ts: string;
    user: string;
    text: string;
};
export declare class Channels extends APIModule {
    archive: (channel: string) => Promise<any>;
    create: (name: string, validate?: boolean) => Promise<Channel>;
    history: (channel: string, options: any) => Promise<Message[]>;
    info: (channel: string) => Promise<Channel>;
    invite: (channel: string, user: string) => Promise<Channel>;
    join: (channel: string) => Promise<Channel>;
    kick: (channel: string, user: string) => Promise<any>;
    leave: (channel: string) => Promise<void>;
    list: () => Promise<Channel[]>;
    mark: (channel: string, ts: string) => Promise<any>;
    rename: (channel: string, name: string, validate?: boolean) => Promise<Channel>;
    replies: (channel: string, threadTs: string) => Promise<Message[]>;
    setPurpose: (channel: string, purpose: string) => Promise<any>;
    setTopic: (channel: string, topic: string) => Promise<any>;
    unarchive: (channel: string) => Promise<any>;
    getMessage: (channel: string, ts: string) => Promise<Message>;
}
