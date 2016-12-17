import Adapter from '../types/adapter'
import BotMessage from '../types/messages/bot'
import { EventEmitter } from 'events'

export default class Console extends EventEmitter implements Adapter {

  constructor () {
    super()
    const stdin = process.stdin;

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume()

    // i don't want binary, do you?
    stdin.setEncoding('utf8')

    // on any data into stdin
    stdin.on('data', (key) => {
      this.emit('message', {
        id: new Date().getMilliseconds(),
        text: key.trim(),
        user: 'dempfi',
        chat: 'stdin'
      })
    });
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
