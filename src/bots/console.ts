import Bot from '../lib/bot'
import Dialog from '../dialog'
import Command from '../command'

export default class Console extends Bot<string, { name: string }> {
  constructor(options: { dialogs: (typeof Dialog)[], commands?: (typeof Command)[] }) {
    super(options)
    const stdin = process.stdin
    stdin.resume()
    stdin.setEncoding('utf8')
    stdin.on('data', (key) =>
      this.onMessage({
        id: new Date().getMilliseconds(),
        text: key.trim(),
        user: 'dempfi',
        chat: 'stdin'
      })
    )
  }

  async user() {
    return {
      name: 'dempfi'
    }
  }

  async users() {
    return [{
      name: 'dempfi'
    }]
  }

  async send(chat: string, message: string) {
    console.log('Bot says: ', message)
    console.log('---------------')
  }
}
