import {EventEmitter} from 'events'
import { default as BotMessage } from './messages/bot'
import { default as UserMessage } from './messages/user'

interface Adapter extends EventEmitter {
  sendMessage (message: BotMessage): void
  getUser (id: string): any
}

export default Adapter
