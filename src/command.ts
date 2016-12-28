import { template } from 'lodash'
import Bot from './lib/bot'
import IMessage from './types/bot-message'
import normalizeMessage from './lib/normalize-message'

export default class Command<B extends Bot<any, any>> {
  constructor(user: string, public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }

  message(message: B['IMessage']) {
    const fmt = (t: string) => template(t, { imports: this })()
    // TODO FIX THIS
    let {text, attachments} = normalizeMessage(message)
    attachments = attachments.map(a => ({ title: fmt(a.title), body: fmt(a.body), buttons: a.buttons }))
    return this.bot.send(this.chat, { text, attachments })
  }

  do(): Promise<void> | void { }
}
