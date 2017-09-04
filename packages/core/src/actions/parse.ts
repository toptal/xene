import { Resolvable } from '../resolvable'
import { Action, FailureHandler } from './action'
import { UserMessage, ParseType } from '../types'

export class Parse<T = any> extends Action {
  protected _resolvable = new Resolvable<T>()
  protected _parse: (reply: string) => T

  constructor(parser: ParseType<T>, onFailure?: FailureHandler) {
    super(onFailure)
    if (typeof parser !== 'function') {
      this._parse = parser.parse
      this._isValid = parser.isValid
    } else this._parse = parser
  }

  perform(message: UserMessage): boolean {
    const parsed = this._parse(message.text)
    const isValid = this._isValid(parsed)
    if (isValid || !this.hasFailureHandler)
      this._resolvable.resolve(parsed)
    return isValid ? true : !this.hasFailureHandler
  }

  get promise() {
    return this._resolvable.promise
  }

  protected _isValid(parsed: T) {
    return parsed != null
  }
}
