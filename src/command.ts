import { template } from 'lodash'

export default class Command {
  constructor(public chat: string, public bot: any, public users: any) {
    this.message = this.message.bind(this)
  }

  static match(message: string): boolean { return false }

  message(message: string) {
    const formatted = template(message, { imports: this })()
    return this.bot.send(this.chat, message)
  }

  do(): Promise<void> | void { }
}
