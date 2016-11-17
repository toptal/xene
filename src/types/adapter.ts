import {EventEmitter} from 'events'
import { default as BotMessage } from './messages/bot'
import { default as UserMessage } from './messages/user'
import { default as User, SearchUser } from './user'

interface Adapter extends EventEmitter {
  sendMessage (chat: string, message: BotMessage): Promise<any>
  findUser (idOrTerm: string | SearchUser): User
  getChat (userNameOrChatName: string, type: string): Promise<string>
}

export default Adapter
