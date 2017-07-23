import { Bot } from './bot'

export class Command<B extends Bot<any, { id: string }>> {
  static match(message: string): boolean { return false }
  user: B['_']['User']

  constructor(public bot: B, public chat: string) {
    this.message = this.message.bind(this)
  }

  message(message: B['_']['Message']) {
    const formatted = this.bot.formatMessage(message, this)
    return this.bot.sendMessage(this.chat, formatted)
  }

  stopDialog() {
    this.bot.stopDialog(this.chat, this.user.id)
  }

  perform(): Promise<void> | void {
    throw new Error('Method perform is not defined')
  }
}
