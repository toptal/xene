import { Binder } from './binder';
import { Dialog } from './dialog';
import { UserMessage } from './types';
export declare abstract class Bot<BotMessage = any> {
    when: (matcher: import("./binder").AnyMatcher) => Binder<this>;
    _: {
        BotMessage: BotMessage;
    };
    private _channels;
    abstract listen(arg?: any): this;
    abstract say(channel: string, message: BotMessage): Promise<any>;
    dialog(channel: string, users: string[]): Dialog<this, this["_"]["BotMessage"]>;
    abortDialog(channel: string, user: string): void;
    protected onMessage(message: UserMessage): any;
}
