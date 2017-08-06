import { Bot } from './bot'
import { Parser } from './parser'
import { UserMessage } from './types'
import { Resolvable } from './resolvable'

export class Question<T = any>{
  private _isSend = false
  private _resolvable = new Resolvable<T>()

  constructor(
    private _bot: Bot,
    private _chat: string,
    private _message: any,
    private _parser: Parser<T>,
    private _onError?: (reply: any) => any
  ) { }

  get isSend() { return this._isSend }
  get promise() { return this._resolvable.promise }

  ask() {
    if (this._isSend) return
    this._isSend = true
    this._bot.say(this._chat, this._message)
  }

  tryToParse(message: UserMessage): boolean {
    const parsed = this._parser.parse(message)
    const isValid = this._parser.isValid(parsed)
    if (isValid) this._resolvable.resolve(parsed)
    else this.onError(message)
    return isValid
  }

  private onError(message: UserMessage) {
    if (this._onError) return this._onError(message)
    return this._bot.say(this._chat, this._message)
  }
}
