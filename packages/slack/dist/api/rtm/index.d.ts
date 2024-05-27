import { APIModule } from '../base';
import { On, Off } from './types';
export declare class RTM extends APIModule {
    on: On;
    off: Off;
    private inc;
    private ws;
    private ee;
    private pingTimer;
    private lastPong;
    protected get token(): string;
    constructor(token: any);
    connect: () => Promise<any>;
    typing(channel: string): void;
    private emit;
    private handleHello;
    private reconnect;
    private disconnect;
    private pingServer;
    private wsSend;
}
