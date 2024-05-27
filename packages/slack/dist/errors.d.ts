export declare class ClientError extends Error {
    message: string;
    constructor(message: string);
}
export declare class NotFound extends ClientError {
    constructor(type: string, args: any);
}
export declare class APIError extends ClientError {
    constructor(message: string);
}
