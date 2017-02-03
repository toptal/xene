import { template } from 'lodash'
import * as readline from 'readline'
import Bot from '../../lib/bot'
import Dialog from '../../dialog'
import Command from '../../command'

const user: string = process.env.USER || 'anonymus'

export default class Consolebot extends Bot<string, { id: string; name: string }> {
  private line: readline.ReadLine
  constructor(options: { dialogs: typeof Dialog[], commands?: typeof Command[] }) {
    super(options)
    this.line = readline.createInterface({ input: process.stdin, output: process.stdout })
    this.line.setPrompt('> ')
    this.line.prompt()
    this.line.on('line', this.onText.bind(this))
  }

  onText(text: string) {
    if (!text) return this.line.prompt()
    const id = new Date().getUTCMilliseconds()
    this.onMessage({ id, text, chat: 'line', user: 'dempfi' })
  }

  async getUser() {
    return { id: user, name: user }
  }

  formatMessage(message: string, object: any): string {
    try {
      return template(message, { imports: object })()
    } catch (e) {
      throw new Error(`Failed to format message ${message} because ${e}.`)
    }
  }

  async sendMessage(chat: string, message: string) {
    console.log('Consolebot: ' + message)
    this.line.prompt()
  }
}
