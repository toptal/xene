import {
  isNil,
  isString,
  isFunction,
  isPlainObject,
  template
} from 'lodash'
import Bot from './bot'
import IAdapter from './adapters/interface'
import IMessage from './types/bot-message'
import DialogQueue from './ext/dialog-queue'
import normalizeMessage from './ext/normalize-message'

export default class Dialog<T extends Bot<IAdapter>> {
  queue: DialogQueue = new DialogQueue()

  constructor(user: string, public bot: T, public chat: string) {
    this.ask = this.ask.bind(this)
    this.parse = this.parse.bind(this)
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }
  async talk(): Promise<void> { }

  message(message: string | IMessage) {
    const fmt = (t: string) => template(t, { imports: this })()
    let {text, attachments} = normalizeMessage(message)
    attachments = attachments.map(a => ({ title: fmt(a.title), body: fmt(a.body), buttons: a.buttons }))
    return this.bot.send(this.chat, { text, attachments })
  }

  parse<T>(parserFunc: (msg: string) => T): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorMessage: string | IMessage): Promise<T>
  parse<T>(parserFunc: (msg: string) => T, errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: string | IMessage): Promise<T>
  parse<T>(
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  parse<T>(
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: string | IMessage | ((reply: string, parsed: T) => void)
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

  ask<T>(message: string | IMessage, parserFunc: (msg: string) => T): Promise<T>
  ask<T>(message: string | IMessage, parserFunc: (msg: string) => T, errorMessage: string | IMessage): Promise<T>
  ask<T>(
    message: string | IMessage,
    parserFunc: (msg: string) => T,
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  ask<T>(
    message: string | IMessage,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean }): Promise<T>
  ask<T>(
    message: string | IMessage,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorMessage: string | IMessage): Promise<T>
  ask<T>(
    message: string | IMessage,
    parserObject: { parse: (msg: string) => T, check: (parsed: T) => boolean },
    errorCallback: (reply: string, parsed: T) => void): Promise<T>
  async ask<T>(
    message: string | IMessage,
    parser: ((msg: string) => T) | { parse: (msg: string) => T, check: (parsed: T) => boolean },
    error?: string | IMessage | ((reply: string, parsed: T) => void)
  ): Promise<T> {
    await this.message(message)
    this.queue.resetMessage()
    if (!error) return this.parse<T>(parser as (msg: string) => T)
    else return this.parse<T>(parser as (msg: string) => T, error as string)
  }
}
