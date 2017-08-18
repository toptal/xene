import { Parser } from './parser'
import { ParseType, UserMessage } from './types'

export class Question<T = any> extends Parser<T> {
  constructor(
    public ask: () => any,
    parser: ParseType<T>,
    onError?: (reply: any) => any
  ) { super(parser, onError || ask) }

  parse(message: UserMessage): boolean {
    const parsed = this._parse(message.text)
    const isValid = this._isValid(parsed)
    if (isValid) this._resolvable.resolve(parsed)
    return isValid
  }
}
