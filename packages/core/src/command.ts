import { Bot as B } from './bot'

export class Command<
  Bot extends B<any, { id: string }>,
  BotMessage extends Bot['_']['Message']= Bot['_']['Message'],
  User extends Bot['_']['User']= Bot['_']['User']
  > {

  static match(message: string): boolean { return false }
  user: User

  constructor(public bot: Bot, public chat: string) {
    this.message = this.message.bind(this)
  }

  message(message: BotMessage) {
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
