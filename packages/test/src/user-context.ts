import { Bot } from '@xene/core'

export class UserContext<B extends Bot = Bot> {
  constructor(private _subject: B) { }

  says(text, chat?, user?) {
    const bot = this._subject as any
    const id = `I${Math.random().toString()}`
    chat = chat || `C${Math.random().toString()}`
    user = user || `U${Math.random().toString()}`
    bot.onMessage({ text, chat, user, id })
  }
}
