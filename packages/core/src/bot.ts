import { Parser } from './parser'
import { Dialog } from './dialog'
import { ChatQueue } from './queue'
import { Question } from './question'
import { UserMessage, Register } from './types'

export type WhenRegister<T extends Bot> = {
  dialog: (handler: (dialog: Dialog<T>) => any) => T
  command: (handler: (bot: T) => any) => T
}

export abstract class Bot<BotMessage = any> {

  _: { BotMessage: BotMessage }

  private _chats = new Map<string, ChatQueue>()
  private _dialogs: Register<Dialog<this>>[] = []
  private _commands: Register<this>[] = []

  abstract listen(arg?: any): this
  abstract say(chat: string, message: BotMessage): Promise<any>

  ask<T>(
    chat: string,
    users: string[],
    message: BotMessage,
    parser: Parser<T>,
    onError?: (reply: string) => any
  ): Promise<T> {
    const question = new Question<T>(this, chat, message, parser, onError)
    this.chatFor(chat).add(question, users)
    return question.promise
  }

  when(match: (message: string) => boolean): WhenRegister<this> {
    return {
      dialog: this.register(match, '_dialogs'),
      command: this.register(match, '_commands')
    }
  }

  protected onMessage(message: UserMessage): void {
    const command = this._commands.find(c => c.match(message.text))
    if (command) return command.handler(this)

    const chat = this.chatFor(message.chat)
    if (!chat.queueFor(message.user).isEmpty) {
      chat.processMessage(message)
    }

    const dialog = this._dialogs.find(c => c.match(message.text))
    if (dialog) dialog.handler(new Dialog(this, message.chat, [message.user]))
  }

  private chatFor(chat: string) {
    const queue = this._chats.get(chat) || new ChatQueue()
    this._chats.set(chat, queue)
    return queue
  }

  private register = (match, type) => handler => {
    this[type].push({ match, handler })
    return this
  }
}
