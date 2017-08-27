import { Bot } from '@xene/core'
import { BotContext } from './bot-context'
import { UserContext } from './user-context'

export class Tester<B extends Bot> {
  bot = new BotContext(this._subject)
  user = new UserContext(this._subject)
  constructor(private _subject: B) { }
}
