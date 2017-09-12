import { Bot } from '@xene/core'
import { isEqual as is } from 'lodash'
import { Resolvable } from './resolvable'
import { BotContext } from './bot-context'

export type On<B extends Bot> =
  (message: string, channel?: string, user?: string) => Expectation<B>

export class Expectation<B extends Bot> {
  static create = <B extends Bot, C extends BotContext>(context: C): On<B> =>
    (message, ...args) => new Expectation<B>(context, message, ...args)

  private constructor(
    private _context: BotContext, private _message: string,
    private _channel: string = `C${Math.random().toString()}`,
    private _user: string = `U${Math.random().toString()}`
  ) { }

  says(message: B['_']['BotMessage'], channel?: string): Promise<boolean> {
    const resolvable = new Resolvable<boolean>()
    const check = (c, m) => resolvable.resolve(is(c, channel || this._channel) && is(m, message))
    this._context._add(check, this._message, this._channel, this._user)
    return resolvable.promise
  }
}
