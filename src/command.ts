import { template } from 'lodash'
import Bot from './bot'
import IAdapter from './adapters/interface'
import IMessage from './types/bot-message'
import normalizeMessage from './ext/normalize-message'

export default class Command<T extends Bot<IAdapter>> {
  constructor(user: string, public bot: T, public chat: string) {
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }

  message(message: string) {
    const fmt = (t: string) => template(t, { imports: this })()
    let {text, attachments} = normalizeMessage(message)
    attachments = attachments.map(a => ({ title: fmt(a.title), body: fmt(a.body), buttons: a.buttons }))
    return this.bot.send(this.chat, { text, attachments })
  }

  do(): Promise<void> | void { }
}
