import { Message } from '../../types';
export declare const toSlack: ({ attachments, ...rest }: Message) => any;
export declare const fromSlack: (message: any) => Message;
