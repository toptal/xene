import { IMessage } from '../api/types/message'

interface IContext {
  callbackId: string
  action: { value: string, type: 'select' | 'button', id: string }
  responseUrl: string
  message: IMessage
  channel: string
  token: string
  user: string

  sendStatus(status: number): void
  replaceMessage(message: IMessage): void
  updateMessage(partial: Partial<IMessage>): void
  deleteMessage(): void
}

export default IContext
