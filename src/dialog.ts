import Bot from './lib/bot'
import DialogQueue from './lib/dialog-queue'
import { isNil, isString, isFunction, isPlainObject } from 'lodash'

class Dialog<B extends Bot<any, any>> {
  static isDefault = false
  static match(message: string): boolean { return false }

  queue: DialogQueue = new DialogQueue()

  constructor(user: string, public bot: B, public chat: string) {
    this.ask = this.ask.bind(this)
    this.parse = this.parse.bind(this)
    this.message = this.message.bind(this)
  }

  async talk(): Promise<void> {
    // implemented in a subclass
  }

  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.sendMessage(this.chat, formatted)
  }

  // Id error handler doesn't exist don't check
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
    if (!error) return this.parse<T>(parser as (msg: string) => T)
    else return this.parse<T>(parser as (msg: string) => T, error as string)
  }
}

export default Dialog
