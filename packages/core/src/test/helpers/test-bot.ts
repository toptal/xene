import { Bot } from '../../bot'

export class TestBot extends Bot<string> {
  messages: { chat: string, message: string }[] = []
  listen() { return this }

  async say(chat: string, message: string) {
    this.messages.push({ chat, message })
  }

  get lastMessage() {
    return this.messages[this.messages.length - 1]
  }

  incoming(chat: string, user: string, text: string) {
    this.onMessage({ id: '', chat, user, text })
  }
}
