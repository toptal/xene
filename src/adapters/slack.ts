// import * as config from 'config'
// import {post} from 'lib/utils/request'
import * as _ from 'lodash'
import {EventEmitter} from 'events'
import {
   RtmClient,
   RTM_EVENTS,
   CLIENT_EVENTS,
   RTM_MESSAGE_SUBTYPES
} from '@slack/client'

import SlackClient from 'slack-client'

import { default as User, SearchUser } from '../types/user'
import { default as BotMessage } from '../types/messages/bot'
import { default as UserMessage } from '../types/messages/user'
import Adapter from '../types/adapter'

const KNOWN_EVENTS = {
  [RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN]: 'slack.join',
  [RTM_MESSAGE_SUBTYPES.GROUP_JOIN]: 'slack.join'
}

import * as attachment from './helpers/attachment'

interface SlackPayload {
  ts: string
  text: string
  user?: string
  channel: string
  subtype?: string
}

export default class SlackAdapter extends SlackClient implements Adapter {
  profile: any
  rtmStore: any
  rtmClient: RtmClient
  messageChain = Promise.resolve(null)

  emmiter: EventEmitter
  on: (event: string | symbol, listener: Function) => EventEmitter
  emit: (event: string | symbol, ...args: any[]) => boolean

  constructor (token: string) {
    super(token)
    this.runClients(token)
    this.bindEmiiter()
  }

  private bindEmiiter () {
    this.emmiter = new EventEmitter()
    this.on = this.emmiter.on.bind(this.emmiter)
    this.emit = this.emmiter.emit.bind(this.emmiter)
  }

  private runClients (slackToken: string) {
    const rtmClient = new RtmClient(slackToken, {logLevel: 'error'})
    rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.profile = d.self))
    rtmClient.on(RTM_EVENTS.MESSAGE, this.handleRtmMessage.bind(this))
    rtmClient.start()
    this.rtmClient = rtmClient
    this.rtmStore = rtmClient.dataStore
  }

   private handleRtmMessage (payload: SlackPayload) {
    if (!payload.user) {
      return
    }

    const isSelf = this.profile.id === payload.user
    const event = this.isEvent(payload.subtype)

    if (isSelf && event) {
      return this.emit(`message.${event}`, payload)
    }

    const message: UserMessage = {
      id: payload.ts,
      text: payload.text,
      user: payload.user,
      chat: payload.channel
    }

    const isBotMentioned = this.isBotMentioned(payload.text)
    const isPrivate = Boolean(this.rtmStore.getDMById(payload.channel))

    if (!isSelf && (isPrivate || isBotMentioned)) {
      this.emit('message', message)
    }
  }

  private chatType (str): 'channel' | 'group' | 'direct' {
    switch (str.substring(0, 1)) {
      case 'C': return 'channel'
      case 'G': return 'group'
      case 'D': return 'direct'
    }
  }

  private isEvent (subtype: string): string | undefined {
    return KNOWN_EVENTS[subtype]
  }

  private isBotMentioned (text: string) {
    const idrx = new RegExp(this.profile.id, 'i')
    return idrx.test(text)
  }

  public send (channel: string, message: BotMessage) {
    message.attachments = attachment.format(message.attachments)
    return super.send(channel, message)
  }
}
