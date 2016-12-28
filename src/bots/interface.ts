import Bot from '../bot'
import { IAttachment } from '../types/bot-message'

interface IAdapter {
  linkBot(bot: Bot<IAdapter>): void
  send(chat: string, message: { text: string, attachments: IAttachment[] }): Promise<any>
}

export default IAdapter
