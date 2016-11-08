import Bot from './bot';
import Topic from './types/topic';
export default class Chat {
    id: string;
    user: string;
    private bot;
    private query;
    private state;
    private queries;
    constructor(id: string, user: string, bot: Bot);
    setTopic(topic: Topic): void;
    handleMessage(messageText: string): Promise<{
        done: boolean;
        next?: string;
        error?: any;
    }>;
    private error(e);
    private nextQuery(key);
    private sendMessage(message);
}
