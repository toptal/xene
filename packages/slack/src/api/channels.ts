import { get, map, filter, find } from 'lodash/fp'
import Base from './base'
import IChannel from './types/channel'
import converter from './converters/camel'

export default class Channels extends Base {
  info(channel: string | Partial<IChannel>) {
    if (typeof channel === 'string') return this.request('info', { channel }).then(get('channel'))
    return this.list().then(find(channel)) as any
  }

  list() {
    return this.request('list').then(get('channels')).then(map(converter))
  }

  join(channel: string): Promise<IChannel> {
    return this.request('join', { name: channel }).then(get('channel')).then(converter)
  }

  invite(channel: string, user: string): Promise<IChannel> {
    return this.request('invite', { channel, user }).then(get('channel')).then(converter)
  }
}
