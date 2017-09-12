import { Bot as B } from './bot'
import { Manager } from './manager'
import { Pause } from './actions/pause'
import { Parse } from './actions/parse'
import { Question } from './actions/question'
import { UserMessage, ParseType, ParseFun, ParseObj } from './types'

const isMessage = <T>(arg): arg is object =>
  arg != null && typeof arg !== 'function'

const errorHandler = (say, arg): ((reply: string) => any) =>
  isMessage(arg) ? () => say(arg) : arg

export class Dialog<
  Bot extends B,
  BotMessage extends Bot['_']['BotMessage']= Bot['_']['BotMessage']> {

  bot: Bot
  users: string[]
  channel: string
  isPaused: boolean = false
  /** @internal */
  _manager: Manager
  get user() { return this.users[0] }

  constructor(bot: Bot, channel: string, users: string[]) {
    this.bot = bot, this.channel = channel, this.users = users
    this._manager = new Manager(bot, channel, users)
    this.parse = this.parse.bind(this)
    this.ask = this.ask.bind(this)
    this.say = this.say.bind(this)
  }

  on(event: 'end', callback: () => any)
  on(event: 'abort', callback: () => any)
  on(event: 'pause', callback: () => any)
  on(event: 'unpause', callback: () => any)
  on(event: 'incomingMessage', callback: (message: UserMessage) => any)
  on(event: 'outgoingMessage', callback: (channel: string, message: BotMessage) => any)
  on(event: string, callback: (...args: any[]) => any) {
    this._manager.on(event, callback)
  }

  end() {
    this._manager.emit('end')
    this._manager.unbind()
  }

  pause(message: BotMessage) {
    this.isPaused = true
    this._manager.emit('pause')
    const handler = () => this.say(message, false)
    this._manager.add(new Pause(handler))
  }

  say(message: BotMessage, unpause: boolean = true) {
    this._manager.emit('outgoingMessage', this.channel, message)
    if (this.isPaused && unpause) {
      this._manager.unpause()
      this._manager.emit('unpause')
      this.isPaused = false
    }
    return this.bot.say(this.channel, message)
  }

  parse<T>(parserFunc: ParseFun<T>): Promise<T>
  parse<T>(parserFunc: ParseFun<T>, errorMessage: BotMessage): Promise<T>
  parse<T>(parserFunc: ParseFun<T>, errorCallback: (reply: string) => any): Promise<T>
  parse<T>(parserObject: ParseObj<T>, errorMessage: BotMessage): Promise<T>
  parse<T>(parserObject: ParseObj<T>, errorCallback: (reply: string) => any): Promise<T>
  parse<T>(parser: ParseType<T>, onError?: BotMessage | ((reply: string) => any)): Promise<T> {
    const parserObj = new Parse(parser, errorHandler(this.say, onError))
    this._manager.add(parserObj)
    return parserObj.promise
  }

  ask<T>(message: BotMessage, parserFunc: ParseFun<T>): Promise<T>
  ask<T>(message: BotMessage, parserFunc: ParseFun<T>, errorMessage: BotMessage): Promise<T>
  ask<T>(message: BotMessage, parserFunc: ParseFun<T>, errorCallback: (reply: string) => any): Promise<T>
  ask<T>(message: BotMessage, parserObject: ParseObj<T>): Promise<T>
  ask<T>(message: BotMessage, parserObject: ParseObj<T>, errorMessage: BotMessage): Promise<T>
  ask<T>(message: BotMessage, parserObject: ParseObj<T>, errorCallback: (reply: string) => any): Promise<T>
  ask<T>(message: BotMessage, parser: ParseType<T>, onError?: BotMessage | ((reply: string) => any)) {
    const sayMessage = () => this.say(message)
    const question = new Question(sayMessage, parser, errorHandler(this.say, onError))
    this._manager.add(question)
    return question.promise
  }
}
