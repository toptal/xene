import { Bot } from '@xene/core'
import { isEqual } from 'lodash'
import { BotContext } from './bot-context'

export class Tester<B extends Bot> {
  constructor(private _subject: B) {
    this.user = {
      says(text, chat?, user?) {
        const bot = _subject as any
        const id = `I${Math.random().toString()}`
        chat = chat || `C${Math.random().toString()}`
        user = user || `U${Math.random().toString()}`
        bot.onMessage({ text, chat, user, id })
      }
    }
  }
  bot = new BotContext(this._subject)
  user: { says(message: string, chat?: string, user?: string): any }
}
