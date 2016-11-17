import Chat from './chat';
import Scenario from './types/scenario';
export default class Performer {
    private chat;
    private user;
    private users;
    private state;
    private query;
    private queries;
    constructor(scenario: Scenario, user: string | {
        [name: string]: string;
    }, chat: Chat);
    input(text: string): Promise<boolean>;
    private setScenario(scenario);
    private tryReplaceScenario(scenarioTitle?);
    private trySaveState(key?, value?);
    private setNextQuery(key?);
    private loadUsers(user);
    private trySendMessage(partialMessage);
}
