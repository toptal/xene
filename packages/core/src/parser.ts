import { Resolvable } from './resolvable'
import { UserMessage, ParseType } from './types'

export class Parser<T = any> {
  protected _resolvable = new Resolvable<T>()
  protected _parse: (reply: string) => T
  protected _isValid(parsed: T) { return parsed != null }

  constructor(
    parser: ParseType<T>,
    protected _onError?: (reply: any) => any
  ) {
    if (typeof parser !== 'function') {
      this._parse = parser.parse
      this._isValid = parser.isValid
    } else this._parse = parser
  }

  tryToParse(message: UserMessage): boolean {
    const parsed = this._parse(message.text)
    const isValid = this._isValid(parsed)
    if (isValid) this._resolvable.resolve(parsed)
    else if (this.hasOnError) this._onError(message)
    else this._resolvable.resolve(parsed)
    return isValid ? true : !this.hasOnError
  }

  get hasOnError() {
    return Boolean(this._onError)
  }

  get promise() {
    return this._resolvable.promise
  }
}
