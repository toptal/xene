export declare function format(attachments: any): any;
export declare function parse(payload: any): {
    parsed: {
        message: any;
        channel: any;
        user: any;
        isAction: boolean;
    };
    replaced: {
        text: any;
        attachments: any;
    };
};
