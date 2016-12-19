import Adapter from './adapter'
import BotMessage from '../types/messages/bot'
import { EventEmitter } from 'events'

export default class Console extends EventEmitter implements Adapter {

  constructor() {
    super()
    const stdin = process.stdin
    stdin.resume()
    stdin.setEncoding('utf8')
    stdin.on('data', (key) =>
      this.emit('message', {
        id: new Date().getMilliseconds(),
        text: key.trim(),
        user: 'dempfi',
        chat: 'stdin'
      })
    )
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

  async send(chat: string, message: BotMessage) {
    console.log('Bot says: ', message.text)
    console.log('---------------')
  }
}
