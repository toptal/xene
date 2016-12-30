import Bot from './lib/bot'

class Command<B extends Bot<any, any>> {
  static match(message: string): boolean { return false }

  constructor(user: string, public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.send(this.chat, formatted)
  }

  do(): Promise<void> | void {
    // implemented in a subclass
  }
}

export default Command
