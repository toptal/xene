import { APIModule } from './base'
import { camel, snake } from './converters'
import { Message, MessageOptions } from '../types'
import * as messageFormat from '../helpers/formatters/message'

export class Chat extends APIModule {
  postMessage(channel: string, message: Message, options: MessageOptions = {}) {
    return this.request('postMessage',
      snake({
        channel, asUser: true, ...options,
        ...messageFormat.toSlack(message)
      }))
      .then(camel)
  }

  update(channel: string, ts: string, message: Message) {
    return this.request('update', snake({
      channel, ts, asUser: true, parse: 'none',
      ...messageFormat.toSlack(message)
    })).then(camel)
  }

  del(channel: string, ts: string, options: { asUser?: boolean } = {}) {
    return this.request('delete', snake({ channel, ts, ...options }))
  }
}
