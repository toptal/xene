import { Bot } from './bot'
import { Dialog } from './dialog'
import { Command } from './command'

export type Statics<T> = {[P in keyof T]: T[P]}
export type BaseUser = { id: string }
export type UserMessage<T extends BaseUser> = {
  id: string | number
  text: string
  chat: string
  user: T
}

export interface DialogFactory<B extends Bot> extends Statics<typeof Dialog> {
  new(bot: B, chat: string): Dialog<B>
}

export interface CommandFactory<B extends Bot> extends Statics<typeof Command> {
  new(bot: B, chat: string): Command<B>
}

export interface BotFactory<B extends Bot = Bot> extends Statics<typeof Bot> {
  new(...args: any[]): B
}
