import { MiddlewareHandler } from '../types';
export declare const middleware: (handler: MiddlewareHandler) => (...args: any[]) => Promise<any>;
