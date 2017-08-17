import { Chat } from './chat'
import { Binder } from './binder'
import { Dialog } from './dialog'
import { UserMessage } from './types'

type Matcher = { match: (message: UserMessage) => boolean }

type DialogHandler<T extends Bot> = Matcher & {
  handler: (dialog: Dialog<T>) => any
}

type PerformerHandler<T> = Matcher & {
  handler: (message: UserMessage, bot: T) => any
}

export abstract class Bot<BotMessage = any> {
  protected _: { BotMessage: BotMessage }
  private _chats = new Map<string, Chat>()

  /** @internal */ _dialogs: DialogHandler<this>[] = []
  /** @internal */ _performers: PerformerHandler<this>[] = []

  abstract listen(arg?: any): this
  abstract say(chat: string, message: BotMessage): Promise<any>

  when = Binder.for(this)

  /** @internal */ _chatFor(chatId: string) {
    const chat = this._chats.get(chatId) || new Chat()
    this._chats.set(chatId, chat)
    return chat
  }

  dialog(chat: string, users: string[]) {
    return new Dialog(this, chat, users)
  }

  protected onMessage(message: UserMessage): any {
    const performer = this._performers.find(c => c.match(message))
    if (performer) return performer.handler(message, this)

    const chat = this._chatFor(message.chat)
    const hasActions = chat.hasFor(message.user)
    if (hasActions) return chat.processMessage(message)

    const dialog = this._dialogs.find(c => c.match(message))
    if (dialog) dialog.handler(new Dialog(this, message.chat, [message.user]))
  }
}
