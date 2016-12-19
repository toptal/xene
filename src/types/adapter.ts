import {EventEmitter} from 'events'
import BotMessage from './messages/bot'
import UserMessage from './messages/user'

interface Adapter {
  on (event: string | symbol, listener: Function): EventEmitter
  emit (event: string | symbol, ...args: any[]): boolean

  send (chat: string, message: BotMessage): Promise<any>
}

export default Adapter
