import { APIModule } from './base'
import { camel, snake } from './converters'
import { Message, MessageOptions } from '../types'
import * as messageFormat from '../helpers/formatters/message'

export class Chat extends APIModule {
  delete(channel: string, ts: string, options: { asUser?: boolean } = {}): Promise<{ channel: string, ts: string }> {
    return this.request('delete', snake({ channel, ts, ...options }))
  }

  meMessage(channel: string, text: string): Promise<{ channel: string, ts: string }> {
    return this.request('meMessage', { channel, text })
  }

  postEphemeral(channel: string, message: Message, options: MessageOptions = {}): Promise<{ messageTs: string }> {
    return this.request('postEphemeral',
      snake({
        channel, asUser: true, ...options,
        ...messageFormat.toSlack(message)
      }))
      .then(camel)
  }

  postMessage(channel: string, message: Message, options: MessageOptions = {})
    : Promise<{ channel: string, ts: string, message: Message }> {
    return this.request('postMessage',
      snake({
        channel, asUser: true, ...options,
        ...messageFormat.toSlack(message)
      }))
      .then(messageFormat.fromSlack)
      .then(camel)
  }

  update(channel: string, ts: string, message: Message) {
    return this.request('update', snake({
      channel, ts, asUser: true, parse: 'none',
      ...messageFormat.toSlack(message)
    })).then(camel)
  }
}
