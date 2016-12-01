import Bot from '../bot'
import {PartialMessage, PartialMessageResolver} from '../types/messages/bot'
import {
  default as Query,
  QueryOptions,
  QueryReturn
} from './query'


export class Message extends Query {
  message: PartialMessage | PartialMessageResolver | string

  constructor (message: PartialMessage | PartialMessageResolver | string, options: QueryOptions) {
    super(options)
    this.message = message
  }

  handle (state: {[k: string]: any}, bot: Bot, message: string): QueryReturn {
    if (this.skipStep(state, bot)) {
      return this.skippingState
    }
    return this.returnValue({
      message: this.formatMessage(this.message, state)
    })
  }
}

export default (message: PartialMessage | PartialMessageResolver | string, options?: QueryOptions): () => Message => {
  return () => new Message(message, options || {})
}
