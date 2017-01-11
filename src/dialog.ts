import Bot from './lib/bot'
import DialogQueue from './lib/dialog-queue'
import { isNil, isString, isFunction, isPlainObject } from 'lodash'

class Dialog<B extends Bot<any, {id: string}>> {
  static isDefault = false
  static match(message: string): boolean { return false }

  user: B['IUser']
  queue: DialogQueue = new DialogQueue()

  constructor(public bot: B, public chat: string) {
    this.ask = this.ask.bind(this)
    this.parse = this.parse.bind(this)
    this.message = this.message.bind(this)
  }

  /**
   * All communication logic(send a message, parse, ask something) during dialog
   * lifecycle are located here. This method is called by `Bot` if user's message
   * is a start for this dialog. When `Promise` returned by `talk` is resolved,
   * `Bot` counts that as the end of the dialog and will not send next messages
   * to this dialog, but run `match` on dialogs and try to find next suitable
   * dialog.
   */
  async talk(): Promise<void> {
    // implemented in a subclass
  }

  /**
   * Format and send message to user.
   * To learn more about formatting, check [[formatting spec]]
   */
  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.sendMessage(this.chat, formatted)
  }

  /**
   * Queue parse for user messages
   */
  parse<T>(parserFunc: (msg: string) => T): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorMessage: B['IMessage']): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: B['IMessage']): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: B['IMessage'] | ((reply: string, parsed: T) => void)
  ): Promise<T> {
    let errorCallback: (reply: string, parsed: T) => void
    if (error && (isString(error) || isPlainObject(error))) errorCallback = () => this.message(error)
    else errorCallback = error as (reply: string, parsed: T) => void
    if (isFunction(parser)) parser = { parse: parser, check: (parsed) => !isNil(parsed) }

    return new Promise((resolve, reject) => this.queue.push({
      parser: parser as { parse: (msg: string) => T, check: (parsed: T) => boolean },
      error: errorCallback as (reply: string, parsed: T) => void,
      done: resolve
    }))
  }

  ask<T>(message: B['IMessage'], parserFunc: (msg: string) => T): Promise<T>
  ask<T>(message: B['IMessage'], parserFunc: (msg: string) => T, errorMessage: B['IMessage']): Promise<T>
  ask<T>(
    message: B['IMessage'],
    parserFunc: (msg: string) => T,
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  ask<T>(
    message: B['IMessage'],
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }): Promise<T>
  ask<T>(
    message: B['IMessage'],
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: B['IMessage']): Promise<T>
  ask<T>(
    message: B['IMessage'],
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  async ask<T>(
    message: B['IMessage'],
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: B['IMessage'] | ((reply: string, parsed: T) => void)
  ): Promise<T> {
    await this.message(message)
    this.queue.resetMessage()
    if (!error) return this.parse<T>(parser as (msg: string) => T, () => this.message(message))
    else return this.parse<T>(parser as (msg: string) => T, error as string)
  }

  startDialog(DialogClass: typeof Dialog) {
    this.bot.startDialog(DialogClass, this.chat, this.user.id)
  }
}

export default Dialog
