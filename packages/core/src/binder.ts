import { Bot } from './bot'
import { UserMessage } from './types'

export type Matcher = (message: UserMessage) => boolean
export type AnyMatcher = string | RegExp | Matcher

const withoutGlobal = (rx: RegExp) =>
  new RegExp(rx, rx.flags.replace('g', ''))

const stringMatcher = (str: string) =>
  (message: UserMessage) => message.text === str

const regExpMatcher = (rx: RegExp) =>
  (message: UserMessage) => withoutGlobal(rx).test(message.text)

const normalizeMatcher = (matcher: AnyMatcher): Matcher => {
  if (typeof matcher === 'function') return matcher
  else if (matcher instanceof RegExp) return regExpMatcher(matcher)
  else if (typeof matcher === 'string') return stringMatcher(matcher)
  else throw new Error(`Don't know how to match messages with ${matcher}.`)
}

export class Binder<B extends Bot>{
  constructor(private _bot: B, private _matcher: AnyMatcher) { }

  static for<T extends Bot>(bot: T) {
    return (matcher: AnyMatcher) => new Binder<T>(bot, matcher)
  }

  say(message: B['_']['BotMessage']) {
    return this._bot
  }

  do(handler: (message: UserMessage, bot: B) => any) {
    return this._bot
  }

  talk(handler: (dialog: B) => any) {

  }
}
