import { Attachment, PartialMessage } from '../types/messages/bot';
declare var _default: (message: string | PartialMessage, chat: string) => {
    text: string;
    chat: string;
    attachments?: Attachment[];
};
export default _default;
