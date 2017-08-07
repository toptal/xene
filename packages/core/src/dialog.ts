import { Bot as B } from './bot'
import { Parser } from './parser'
import { Question } from './question'
import { ParseType } from './types'

export class Dialog<
  Bot extends B,
  BotMessage extends Bot['_']['BotMessage']= Bot['_']['BotMessage']> {

  bot: Bot
  chat: string
  users: string[]

  constructor(bot: Bot, chat: string, users: string[]) {
    this.bot = bot, this.chat = chat, this.users = users
  }

  say = (message: BotMessage) => {
    return this.bot.say(this.chat, message)
  }

  ask = <T>(message: BotMessage, parser: ParseType<T>, onError?: BotMessage | ((reply: string) => any)) => {
    const parserObj = new Parser(parser)
    const errorHandler = (onError != null && typeof onError !== 'function') ? () => this.say(onError) : onError
    return this.bot.ask<T>(this.chat, this.users, message, parserObj, errorHandler as (reply: string) => any)
  }
}
