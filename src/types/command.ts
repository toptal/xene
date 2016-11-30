import Chat from '../chat'
import UserMessage from './messages/user'
import {PartialMessage} from './messages/bot'

interface Command {
  matcher: (message: string) => boolean
  message?: string | PartialMessage
  action?: (chat: Chat, message: UserMessage) => boolean | Promise<boolean>
}

export default Command
