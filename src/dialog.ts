import { isFunction, isString, isNil } from 'lodash'
import DialogQueue from './ext/dialog-queue'

export default class Dialog {
  queue: DialogQueue = new DialogQueue()

  constructor(public chat: string, public bot: any, public users: any) {
    this.ask = this.ask.bind(this)
    this.parse = this.parse.bind(this)
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }
  async talk(): Promise<void> { }

  message(message: string) {
    return this.bot.send(this.chat, message)
  }

  parse<T>(parserFunc: (msg: string) => T): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorMessage: string): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: string): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: string | ((reply: string, parsed: T) => void)
  ): Promise<T> {
    let errorCallback: (reply: string, parsed: T) => void
    if (error && isString(error)) errorCallback = () => this.message(error)
    else errorCallback = error as (reply: string, parsed: T) => void
    if (isFunction(parser)) parser = { parse: parser, check: (parsed) => !isNil(parsed) }

    return new Promise((resolve, reject) => this.queue.push({
      parser: parser as { parse: (msg: string) => T, check: (parsed: T) => boolean },
      error: errorCallback as (reply: string, parsed: T) => void,
      done: resolve
    }))
  }

  ask<T>(message: string, parserFunc: (msg: string) => T): Promise<T>
  ask<T>(message: string, parserFunc: (msg: string) => T, errorMessage: string): Promise<T>
  ask<T>(
    message: string,
    parserFunc: (msg: string) => T,
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  ask<T>(
    message: string,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }): Promise<T>
  ask<T>(
    message: string,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: string): Promise<T>
  ask<T>(
    message: string,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  async ask<T>(
    message: string,
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: string | ((reply: string, parsed: T) => void)
  ): Promise<T> {
    await this.message(message)
    this.queue.resetMessage()
    if (!error) return this.parse<T>(parser as (msg: string) => T)
    else return this.parse<T>(parser as (msg: string) => T, error as string)
  }
}
