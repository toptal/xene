import {EventEmitter} from 'events'
import { default as BotMessage } from './messages/bot'
import { default as UserMessage } from './messages/user'
import { default as User, SearchUser } from './user'

interface Adapter {
  on (event: string | symbol, listener: Function): EventEmitter
  emit (event: string | symbol, ...args: any[]): boolean

  send (chat: string, message: BotMessage): Promise<any>
  user (id: string | SearchUser): Promise<User>
}

export default Adapter
