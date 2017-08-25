import { get, map, filter, find, head } from 'lodash/fp'
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

  history(channel: string, options) {
    return this.request('history', { channel, ...options }).then(get('messages')).then(map(camel))
  }

  getMessage(channel: string, ts: string) {
    return this.history(channel, {inclusive: true, count: 1, latest: ts}).then(head)
  }

  create(name: string, validate: boolean = false): Promise<Channel> {
    return this.request('create', { name, validate }).then(get('channel')).then(camel)
  }

  archive(channel: string) {
    return this.request('archive', { channel })
  }

  setTopic(channel: string, topic: string) {
    return this.request('setTopic', {channel, topic})
  }

  setPurpose(channel: string, purpose: string) {
    return this.request('setPurpose', {channel, purpose})
  }
}
