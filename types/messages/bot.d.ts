export interface RelaxedButton {
    label: string;
    value: string;
    type?: 'default' | 'danger' | 'primary';
    confirm?: any;
}
export interface RelaxedAttachment {
    title?: string;
    buttons?: (RelaxedButton | string)[];
}
export interface PartialMessage {
    text?: string;
    attachment?: RelaxedAttachment;
    attachments?: RelaxedAttachment[];
}
export interface PartialMessageResolver {
    (state: Object): string | PartialMessage;
}
export declare type RelaxedMessage = PartialMessage | PartialMessageResolver | string;
export interface Button {
    label: string;
    value: string;
    type: 'default' | 'danger' | 'primary';
    confirm?: any;
}
export interface Attachment {
    title: string;
    buttons: Button[];
    callbackId?: string;
}
declare type Message = {
    text: string;
    chat?: string;
    attachments: Attachment[];
};
export default Message;
