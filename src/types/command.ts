import {PartialMessage, PartialMessageResolver} from './messages/bot'

interface Command {
  command: string | symbol
  message: string | PartialMessage | PartialMessageResolver
  matcher: (message: string) => boolean
}

export default Command
