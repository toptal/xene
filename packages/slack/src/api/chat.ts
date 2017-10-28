import { APIModule } from './base'
import { get } from '../helpers/get'
import { Message, MessageOptions } from '../types'
import { toSlack, fromSlack } from '../helpers/formatters/message'

type ChannelTs = { channel: string, ts: string }
type EphemeralMessage = Message & { user: string }

export class Chat extends APIModule {
  delete = (channel: string, ts: string, options: { asUser?: boolean } = {}): Promise<ChannelTs> =>
    this.request('delete', { channel, ts, ...options })

  meMessage = (channel: string, text: string): Promise<ChannelTs> =>
    this.request('meMessage', { channel, text })

  postEphemeral = (channel: string, message: EphemeralMessage, options: MessageOptions = {})
    : Promise<{ messageTs: string }> =>
      this.request('postEphemeral', { channel, asUser: true, ...options, ...toSlack(message) })

  postMessage = (channel: string, message: Message, options: MessageOptions = {})
    : Promise<ChannelTs & { message: Message }> =>
      this.request('postMessage', { channel, asUser: true, ...options, ...toSlack(message) })
        .then(({ message: m, ...rest }) => ({ message: fromSlack(m), ...rest }))

  update = (channel: string, ts: string, message: Message) =>
    this.request('update', { channel, ts, asUser: true, parse: 'none', ...toSlack(message) })
}
