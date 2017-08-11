import { Bot as B } from './bot'
import { Parser } from './parser'
import { Manager } from './manager'
import { Question } from './question'
import { ParseType } from './types'

export class Dialog<
  Bot extends B,
  BotMessage extends Bot['_']['BotMessage']= Bot['_']['BotMessage']> {

  bot: Bot
  chat: string
  users: string[]

  /** @internal */ _manager = new Manager(this.users)

  constructor(bot: Bot, chat: string, users: string[]) {
    this.bot = bot, this.chat = chat, this.users = users
  }

  say = (message: BotMessage) => {
    return this.bot.say(this.chat, message)
  }

  parse = <T>(parser: ParseType<T>, onError?: BotMessage | ((reply: string) => any)): Promise<T> => {
    const errorHandler = (onError != null && typeof onError !== 'function') ? () => this.say(onError) : onError
    const parserObj = new Parser(parser, errorHandler)
    this._manager.push(parserObj)
    return parserObj.promise
  }

  ask = <T>(message: BotMessage, parser: ParseType<T>, onError?: BotMessage | ((reply: string) => any)) => {
    const errorHandler = (onError != null && typeof onError !== 'function') ? () => this.say(onError) : onError
    const question = new Question(message, parser, onError)
    this._manager.push(question)
    return question.promise
  }
}
