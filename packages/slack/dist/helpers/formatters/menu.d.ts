import { IMenu } from '../../types';
export declare const toSlack: (s: IMenu) => {
    options: {
        text: any;
        value: any;
    }[];
    data_source: "users" | "channels";
    confirm: {
        title: string;
        text: string;
        okText: string;
        dismissText: string;
    };
    type: string;
    text: string;
    name: string;
};
export declare const fromSlack: (s: any) => IMenu;
