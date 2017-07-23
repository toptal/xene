import { get, map, filter, find } from 'lodash/fp'
import { Channel } from '../types'
import { APIModule } from './base'
import { camel } from './converters'

export class Channels extends APIModule {
  info(channel: string | Partial<Channel>) {
    if (typeof channel === 'string') return this.request('info', { channel }).then(get('channel')).then(camel)
    return this.list().then(find(channel)) as any
  }

  list() {
    return this.request('list').then(get('channels')).then(map(camel))
  }

  join(channel: string): Promise<Channel> {
    return this.request('join', { name: channel }).then(get('channel')).then(camel)
  }

  invite(channel: string, user: string): Promise<Channel> {
    return this.request('invite', { channel, user }).then(get('channel')).then(camel)
  }
}
