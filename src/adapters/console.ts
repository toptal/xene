import Bot from '../bot'
import IAdapter from './interface'
import { IAttachment } from '../types/bot-message'

export default class Console implements IAdapter {
  private bot: Bot<IAdapter>

  constructor() {
    const stdin = process.stdin
    stdin.resume()
    stdin.setEncoding('utf8')
    stdin.on('data', (key) =>
      this.bot.onMessage({
        id: new Date().getMilliseconds(),
        text: key.trim(),
        user: 'dempfi',
        chat: 'stdin'
      })
    )
  }

  linkBot(bot) {
    this.bot = bot
  }

  async user() {
    return {
      id: 'dempfi',
      email: 'dempfi',
      handler: 'dempfi',
      fullName: 'dempfi',
      lastName: 'dempfi',
      firstName: 'dempfi'
    }
  }

  async send(chat: string, message: { text: string, attachments: IAttachment []}) {
    console.log('Bot says: ', message.text)
    console.log('---------------')
  }
}
