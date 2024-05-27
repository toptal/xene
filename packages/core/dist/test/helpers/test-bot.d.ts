import { Bot } from '../../bot';
export declare class TestBot extends Bot<string> {
    messages: {
        channel: string;
        message: string;
    }[];
    listen(): this;
    say(channel: string, message: string): Promise<void>;
    get lastMessage(): {
        channel: string;
        message: string;
    };
    incoming(channel: string, user: string, text: string): void;
}
