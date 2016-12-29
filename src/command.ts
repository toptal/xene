import Bot from './lib/bot'

abstract class Command<B extends Bot<any, any>> {
  static match(message: string): boolean { return false }

  constructor(user: string, public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.send(this.chat, formatted)
  }

  abstract do(): Promise<void> | void
}

export default Command
