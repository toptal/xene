import { APIModule } from './base';
export type Bot = {
    id: string;
    name: string;
    appId: string;
    deleted: boolean;
    icons: {
        [key: string]: string;
    };
};
export declare class Bots extends APIModule {
    info: (id: string) => Promise<Bot>;
}
