import {EventEmitter} from 'events'
import { default as BotMessage } from './messages/bot'
import { default as UserMessage } from './messages/user'
import { default as User, SearchUser } from './user'

interface Adapter extends EventEmitter {
  sendMessage (message: BotMessage): void
  getUser (id: string): any
  findUser (idOrTerm: string | SearchUser): User
  getChat (options: any): Promise<string>
}

export default Adapter
