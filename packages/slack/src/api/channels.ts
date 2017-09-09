import { get, map, filter, find, head } from 'lodash/fp'
import { Channel } from '../types'
import { APIModule } from './base'
import { camel, snake } from './converters'

export type Message = { type: string, ts: string, user: string, text: string }

export class Channels extends APIModule {
  archive(channel: string) {
    return this.request('archive', { channel })
  }

  create(name: string, validate: boolean = false): Promise<Channel> {
    return this.request('create', { name, validate }).then(get('channel')).then(camel)
  }

  history(channel: string, options) {
    return this.request('history', { channel, ...options }).then(get('messages')).then(map(camel))
  }

  info(channel: string | Partial<Channel>) {
    if (typeof channel === 'string') return this.request('info', { channel }).then(get('channel')).then(camel)
    return this.list().then(find(channel)) as any
  }

  invite(channel: string, user: string): Promise<Channel> {
    return this.request('invite', { channel, user }).then(get('channel')).then(camel)
  }

  join(channel: string): Promise<Channel> {
    return this.request('join', { name: channel }).then(get('channel')).then(camel)
  }

  kick(channel: string, user: string): Promise<void> {
    return this.request('kick', { channel, user })
  }

  leave(channel: string): Promise<void> {
    return this.request('leave', { channel })
  }

  list() {
    return this.request('list').then(get('channels')).then(map(camel))
  }

  mark(channel: string, ts: string) {
    return this.request('mark', { channel, ts })
  }

  rename(channel: string, name: string, validate: boolean = true): Promise<Channel> {
    return this.request('rename', { channel, name, validate }).then(get('channel')).then(camel)
  }

  replies(channel: string, threadTs: string): Promise<Message[]> {
    return this.request('rename', snake({ channel, threadTs })).then(get('messages')).then(camel)
  }

  setPurpose(channel: string, purpose: string) {
    return this.request('setPurpose', { channel, purpose })
  }

  setTopic(channel: string, topic: string) {
    return this.request('setTopic', { channel, topic })
  }

  unarchive(channel: string) {
    return this.request('unarchive', { channel })
  }

  getMessage(channel: string, ts: string) {
    return this.history(channel, { inclusive: true, count: 1, latest: ts }).then(head)
  }
}
