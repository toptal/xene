import Bot from './bot';
import Performer from './performer';
import UserMessage from './types/messages/user';
import Message from './types/messages/bot';
export default class Chat {
    id: string;
    bot: Bot;
    private performers;
    constructor(id: string, bot: Bot);
    input(message: UserMessage): Promise<void>;
    performByScenario(title: string, user: string | {
        [key: string]: string;
    }): Performer;
    private getOrCreatePerformer(message);
    private setPerformer(scenario, user);
    private removePerformer(performer);
    send(message: string | Message): Promise<any>;
}
