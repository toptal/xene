import { IButton } from '../../types';
export declare const toSlack: (b: IButton) => {
    style: "default" | "danger" | "primary";
    confirm: {
        title: string;
        text: string;
        okText: string;
        dismissText: string;
    };
    value: string;
    type: string;
    text: string;
    name: string;
};
export declare const fromSlack: (b: any) => IButton;
