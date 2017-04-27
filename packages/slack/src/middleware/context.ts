import { IMessage } from '../api/types/message'

interface IContext {
  message: IMessage
  callbackId: string
  action: { value: string, type: 'select' | 'button', id: string }

  sendStatus(status: number): void
  replaceMessage(message: IMessage): void
  updateMessage(partial: Partial<IMessage>): void
  deleteMessage(): void
}

export default IContext
