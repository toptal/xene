import { UserMessage, ParseType, ParseFun } from './types'

export class Parser<T = any> {
  private _parse: (reply: string) => T
  private _isValid: (parsed: T) => boolean

  constructor(parser: ParseType<T>) {
    if (typeof parser !== 'function') {
      this._isValid = parser.isValid
      this._parse = parser.parse
    } else {
      this._isValid = v => v != null
      this._parse = parser
    }
  }

  parse(message: UserMessage): T {
    return this._parse(message.text)
  }

  isValid(parsed: T): boolean {
    return this._isValid(parsed)
  }
}
