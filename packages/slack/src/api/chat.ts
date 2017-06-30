import Base from './base'
import IGroup from './types/group'
import * as converters from './converters'
import * as messageFormat from '../helpers/formatters/message'
import { Message, MessageOptions } from './types/message'

export default class Chat extends Base {
  postMessage(channel: string, message: Message, options: MessageOptions = {}) {
    return this.request('postMessage',
      converters.snake({
        ...messageFormat.toSlack(message),
        ...{ channel, asUser: true },
        ...options }))
      .then(converters.camel)
  }

  del(channel: string, ts: string, options: { asUser?: boolean } = {}) {
    return this.request('delete', converters.snake({ channel, ts, ...options }))
  }
}
