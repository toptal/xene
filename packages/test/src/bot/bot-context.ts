import { Bot } from '@xene/core'
import { isEqual as is } from 'lodash'
import { Expectation } from './expectation'

type Check<B extends Bot> = (chat: string, message: B['_']['BotMessage']) => void
type TExpectation<B extends Bot> = { check: Check<B>, message: string, chat: string, user: string }

export class BotContext<B extends Bot = Bot> {
  constructor(private _subject: B) {
    this._subject.say = this._check.bind(this)
  }

  private _expects: TExpectation<B>[] = []
  on = Expectation.create<B, this>(this)
  messages: { chat: string, message: B['_']['BotMessage'] }[] = []

  get lastMessage() {
    return this.messages[this.messages.length - 1]
  }

  said(message: B['_']['BotMessage'], chat?: string): boolean {
    return this.messages.some(m => chat ? is(m, { chat, message }) : is(m.message, message))
  }


  /** @internal */
  _add(check: Check<B>, message: string, chat: string, user: string) {
    this._expects.push({ check, message, chat, user })
    if (this._expects.length !== 1) return
    this._prepareNext()
  }

  private async _check(chat: string, message: any) {
    this.messages.push({ chat, message })
    if (this._expects.length === 0) return
    this._expects.shift().check(chat, message)
    if (this._expects.length === 0) return
    this._prepareNext()
  }

  private _prepareNext() {
    console.log('n')
    const last = this._expects[this._expects.length - 1]
    const id = `I${Math.random().toString()}`
    const { message, chat, user } = last
    const bot = this._subject as any
    bot.onMessage({ text: message, chat, user, id })
  }
}
