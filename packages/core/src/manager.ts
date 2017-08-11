import { Action } from './chat'
import { Parser } from './parser'
import { Question } from './question'
import { UserMessage } from './types'

const isQuestion = (a): a is Question => a instanceof Question

export class Manager implements Action {
  private _queue: (Parser | Question)[] = []
  private _messages: UserMessage[] = []

  constructor(public users: string[]) { }

  push(action: Parser | Question) {
    this._queue.push(action)
  }

  prepare() {
    if (isQuestion(this._head)) this._head.ask()
  }

  async perform(message: UserMessage) {
    this._messages.push(message)
    if (this._isEmpty) return true
    const wasParsed = this._head.tryToParse(message)
    if (!wasParsed) return false
    this._queue.shift()
    if (isQuestion(this._head)) return true
    else return this.perform(message)
  }

  private get _isEmpty() { return this._queue.length === 0 }
  private get _head() { return this._queue[0] }
}
