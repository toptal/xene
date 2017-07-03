import Base from './base'
import IGroup from './types/group'
import * as converters from './converters'
import * as messageFormat from '../helpers/formatters/message'
import { Message, MessageOptions } from './types/message'

export default class Chat extends Base {
  postMessage(channel: string, message: Message, options: MessageOptions = {}) {
    return this.request('postMessage',
      converters.snake({
        channel, asUser: true, ...options,
        ...messageFormat.toSlack(message)
      }))
      .then(converters.camel)
  }

  update(channel: string, ts: string, message: Message) {
    return this.request('update', converters.snake({
      channel, asUser: true, parse: 'none',
      ...messageFormat.toSlack(message)
    })).then(converters.camel)
  }

  del(channel: string, ts: string, options: { asUser?: boolean } = {}) {
    return this.request('delete', converters.snake({ channel, ts, ...options }))
  }
}
