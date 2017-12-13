import { head } from 'lodash'
import { Channel } from '../types'
import { APIModule } from './base'
import { get } from '../helpers/get'

export type Message = { type: string, ts: string, user: string, text: string }

export class Channels extends APIModule {
  archive = (channel: string) =>
    this.request('archive', { channel })

  create = (name: string, validate: boolean = false) =>
    this.request('create', { name, validate }).then(get<Channel>('channel'))

  history = (channel: string, options) =>
    this.request('history', { channel, ...options }).then(get<Message[]>('messages'))

  info = (channel: string) =>
    this.request('info', { channel }).then(get<Channel>('channel'))

  invite = (channel: string, user: string) =>
    this.request('invite', { channel, user }).then(get<Channel>('channel'))

  join = (channel: string) =>
    this.request('join', { name: channel }).then(get<Channel>('channel'))

  kick = (channel: string, user: string) =>
    this.request('kick', { channel, user })

  leave = (channel: string): Promise<void> =>
    this.request('leave', { channel })

  list = () =>
    this.request('list').then(get<Channel[]>('channels'))

  mark = (channel: string, ts: string) =>
    this.request('mark', { channel, ts })

  rename = (channel: string, name: string, validate: boolean = true): Promise<Channel> =>
    this.request('rename', { channel, name, validate }).then(get<Channel>('channel'))

  replies = (channel: string, threadTs: string) =>
    this.request('rename', { channel, threadTs }).then(get<Message[]>('messages'))

  setPurpose = (channel: string, purpose: string) =>
    this.request('setPurpose', { channel, purpose })

  setTopic = (channel: string, topic: string) =>
    this.request('setTopic', { channel, topic })

  unarchive = (channel: string) =>
    this.request('unarchive', { channel })

  getMessage = (channel: string, ts: string) =>
    this.history(channel, { inclusive: true, count: 1, latest: ts }).then(head)
}
