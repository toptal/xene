import { Parser } from './parser'
import { ParseType, UserMessage } from './types'

export class Question<T = any> extends Parser<T> {
  constructor(
    private _ask: () => any,
    parser: ParseType<T>,
    onError?: (reply: any) => any
  ) { super(parser, onError || _ask) }

  ask() {
    this._ask()
  }

  tryToParse(message: UserMessage): boolean {
    const parsed = this._parse(message.text)
    const isValid = this._isValid(parsed)
    if (isValid) this._resolvable.resolve(parsed)
    else this._onError(message)
    return isValid
  }
}
