import Bot from './lib/bot'

class Command<B extends Bot<any, { id: string }>> {
  static match(message: string): boolean { return false }
  user: B['IUser']

  constructor(public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  message(message: B['IMessage']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.sendMessage(this.chat, formatted)
  }

  stopDialog() {
    this.bot.stopDialog(this.chat, this.user.id)
  }

  perform(): Promise<void> | void {
    // implemented in a subclass
  }
}

export default Command
