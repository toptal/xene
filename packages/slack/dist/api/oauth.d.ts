import { APIModule } from './base';
export declare class Oauth extends APIModule {
    static access(options: {
        id: string;
        secret: string;
        code: string;
        redirectUri?: string;
    }): Promise<any>;
}
