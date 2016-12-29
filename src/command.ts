import Bot from './lib/bot'

export default class Command<B extends Bot<any, any>> {
  constructor(user: string, public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }

  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.send(this.chat, formatted)
  }

  do(): Promise<void> | void { }
}
