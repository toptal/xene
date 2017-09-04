import { Parse } from './parse'
import { ParseType, UserMessage } from '../types'

export class Question<T = any> extends Parse<T> {
  private wasAsked = false

  constructor(
    public _ask: () => any,
    parser: ParseType<T>,
    onFailure?: (reply: string) => any
  ) { super(parser, onFailure || _ask) }

  ask() {
    if (this.wasAsked) return
    this.wasAsked = true
    this._ask()
  }

  perform(message: UserMessage): boolean {
    const parsed = this._parse(message.text)
    const isValid = this._isValid(parsed)
    if (isValid) this._resolvable.resolve(parsed)
    return isValid
  }
}
