import Bot from './bot';
import UserMessage from './types/messages/user';
import Message from './types/messages/bot';
export default class Chat {
    id: string;
    bot: Bot;
    private performers;
    constructor(id: string, bot: Bot);
    input(message: UserMessage): Promise<void>;
    perform(title: string, user: string | {
        [key: string]: string;
    }): void;
    private getOrCreatePerformer(message);
    private setPerformer(scenario, user);
    private removePerformer(performer);
    send(message: string | Message): Promise<any>;
}
