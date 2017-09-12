import { Bot } from '@xene/core'
import { isEqual as is } from 'lodash'
import { Expectation } from './expectation'

type Check<B extends Bot> = (channel: string, message: B['_']['BotMessage']) => void
type TExpectation<B extends Bot> = { check: Check<B>, message: string, channel: string, user: string }

export class BotContext<B extends Bot = Bot> {
  on = Expectation.create<B, this>(this)
  messages: { channel: string, message: B['_']['BotMessage'] }[] = []
  private _expects: TExpectation<B>[] = []

  constructor(private _subject: B) {
    this._subject.say = this._check.bind(this)
  }

  get lastMessage() {
    return this.messages[this.messages.length - 1]
  }

  said(message: B['_']['BotMessage'], channel?: string): boolean {
    return this.messages.some(m => channel ? is(m, { channel, message }) : is(m.message, message))
  }

  reset() {
    this._expects = []
    this.messages = []
  }

  /** @internal */
  _add(check: Check<B>, message: string, channel: string, user: string) {
    this._expects.push({ check, message, channel, user })
    if (this._expects.length !== 1) return
    this._prepareNext()
  }

  private async _check(channel: string, message: any) {
    this.messages.push({ channel, message })
    if (this._expects.length === 0) return
    this._expects.shift().check(channel, message)
    if (this._expects.length === 0) return
    this._prepareNext()
  }

  private _prepareNext() {
    const last = this._expects[this._expects.length - 1]
    const id = `I${Math.random().toString()}`
    const { message, channel, user } = last
    const bot = this._subject as any
    bot.onMessage({ text: message, channel, user, id })
  }
}
