import { Bot } from '../../bot'

export class TestBot extends Bot<string> {
  messages: { channel: string, message: string }[] = []
  listen() { return this }

  async say(channel: string, message: string) {
    this.messages.push({ channel, message })
  }

  get lastMessage() {
    return this.messages[this.messages.length - 1]
  }

  incoming(channel: string, user: string, text: string) {
    this.onMessage({ id: '', channel, user, text })
  }
}
