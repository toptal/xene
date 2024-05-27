import { Attachment } from '../../types';
export declare const toSlack: ({ buttons, menus, ...rest }: Attachment) => {
    text: string;
    title?: string;
    color?: string;
    pretext?: string;
    titleLink?: string;
    authorName?: string;
    authorLink?: string;
    authorIcon?: string;
    callbackId?: string;
    mrkdwnIn?: string[];
    fields?: {
        title: string;
        value: string;
        short?: boolean;
    }[];
    imageUrl?: string;
    thumbUrl?: string;
    footer?: string;
    footerIcon?: string;
    actions: any;
};
export declare const fromSlack: ({ actions, ...rest }: {
    [x: string]: any;
    actions: any;
}) => Attachment;
