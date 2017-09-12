import { Bot } from '@xene/core'

export class UserContext<B extends Bot = Bot> {
  constructor(private _subject: B) { }

  says(text, channel?, user?) {
    const bot = this._subject as any
    const id = `I${Math.random().toString()}`
    channel = channel || `C${Math.random().toString()}`
    user = user || `U${Math.random().toString()}`
    bot.onMessage({ text, channel, user, id })
  }
}
