import { Bot } from './bot'
import { Dialog } from './dialog'
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

export class Binder<B extends Bot> {
  static for<T extends Bot>(bot: T) {
    return (matcher: AnyMatcher) => new Binder<T>(bot, matcher)
  }

  constructor(private _bot: B, private _matcher: AnyMatcher) { }

  say(message: B['_']['BotMessage']) {
    const match = normalizeMatcher(this._matcher)
    const handler = (msg: UserMessage, bot: B) => bot.say(msg.chat, message)
    this._bot._performers.push({ match, handler })
    return this._bot
  }

  do(handler: (message: UserMessage, bot: B) => any) {
    const match = normalizeMatcher(this._matcher)
    this._bot._performers.push({ match, handler })
    return this._bot
  }

  talk(handler: (dialog: Dialog<B>) => any) {
    const match = normalizeMatcher(this._matcher)
    this._bot._dialogs.push({ match, handler })
    return this._bot
  }
}
