export declare abstract class APIModule {
    protected tokens: string | {
        appToken?: string;
        botToken?: string;
    };
    protected namespace: string;
    protected get token(): string;
    constructor(tokens: string | {
        appToken?: string;
        botToken?: string;
    });
    protected request(method: string, form?: object, retriable?: boolean): Promise<any>;
}
