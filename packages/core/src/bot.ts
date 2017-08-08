import { Chat } from './chat'
import { Binder } from './binder'
import { Parser } from './parser'
import { Dialog } from './dialog'
import { Question } from './question'
import { UserMessage, Register } from './types'

export abstract class Bot<BotMessage = any> {
  protected _: { BotMessage: BotMessage }
  private _chats = new Map<string, Chat>()

  /** @internal */ _dialogs: Register<Dialog<this>>[] = []
  /** @internal */ _performers: Register<this>[] = []

  abstract listen(arg?: any): this
  abstract say(chat: string, message: BotMessage): Promise<any>

  when = Binder.for(this)

  // ask<T>(
  //   chat: string,
  //   users: string[],
  //   message: BotMessage,
  //   parser: Parser<T>,
  //   onError?: (reply: string) => any
  // ): Promise<T> {
  //   const question = new Question<T>(this, chat, message, parser, onError)
  //   this.chatFor(chat).add(question, users)
  //   return question.promise
  // }

  protected onMessage(message: UserMessage): any {
    const performer = this._performers.find(c => c.match(message.text))
    if (performer) return performer.handler(this)

    const chat = this.chatFor(message.chat)
    const hasActions = !chat.hasFor(message.user)
    if (hasActions) return chat.processMessage(message)

    const dialog = this._dialogs.find(c => c.match(message.text))
    if (dialog) dialog.handler(new Dialog(this, message.chat, [message.user]))
  }

  private chatFor(chatId: string) {
    const chat = this._chats.get(chatId) || new Chat()
    this._chats.set(chatId, chat)
    return chat
  }
}
