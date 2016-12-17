import * as _ from 'lodash'
import * as uuid from 'node-uuid'

import {EventEmitter} from 'events'
import {
   RtmClient,
   RTM_EVENTS,
   CLIENT_EVENTS,
   RTM_MESSAGE_SUBTYPES
} from '@slack/client'

import SlackClient from 'slack-client'

import { default as UserMessage } from '../types/messages/user'
import { default as User, SearchUser } from '../types/user'
import { default as BotMessage, Attachment } from '../types/messages/bot'

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

export class SlackDispatcher {
  private adapters = new Map<string, SlackAdapter>()
  constructor () {
    this.interactive = this.interactive.bind(this)
  }

  add (id: string, adapter: SlackAdapter) {
    this.adapters.set(id, adapter)
  }

  interactive (req, res) {
    const body = JSON.parse(req.body.payload)
    const adapter = this.adapters.get(body.callback_id)
    const response = adapter.interactiveMessage(body)
    res.send(response)
  }
}

export default class SlackAdapter extends SlackClient implements Adapter {
  id: string
  profile: any
  rtmStore: any
  rtmClient: RtmClient

  on: (event: string | symbol, listener: Function) => EventEmitter
  emit: (event: string | symbol, ...args: any[]) => boolean
  emmiter: EventEmitter

  // Default dispatcher, used when user didn't provide
  // custom dispatcher. This is moslty used when user rans
  // one type of bot, which is a common case
  static dispatcher = new SlackDispatcher()

  constructor (options: {token: string, id?: string, dispacther?: SlackDispatcher}) {
    super(options.token)
    this.bindEmiiter()
    this.id = options.id || uuid.v4()
    this.runClients(options.token)
    if (options.dispacther) options.dispacther.add(this.id, this)
    else SlackAdapter.dispatcher.add(this.id, this)
  }

  private bindEmiiter () {
    this.emmiter = new EventEmitter()
    this.emit = this.emmiter.emit.bind(this.emmiter)
    this.on = this.emmiter.on.bind(this.emmiter)
  }

  private runClients (slackToken: string) {
    const rtmClient = new RtmClient(slackToken, {logLevel: 'error'})
    rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.profile = d.self))
    rtmClient.on(RTM_EVENTS.MESSAGE, this.rtmMessage.bind(this))
    rtmClient.start()
    this.rtmClient = rtmClient
    this.rtmStore = rtmClient.dataStore
  }

   private rtmMessage (payload: SlackPayload) {
    if (!payload.user) return

    const isSelf = this.profile.id === payload.user
    const event = this.isEvent(payload.subtype)

    if (isSelf && event) return this.emit(`message.${event}`, payload)

    const message: UserMessage = {
      id: payload.ts,
      text: payload.text,
      user: payload.user,
      chat: payload.channel
    }

    const isBotMentioned = this.isBotMentioned(payload.text)
    const isPrivate = Boolean(this.rtmStore.getDMById(payload.channel))

    if (!isSelf && (isPrivate || isBotMentioned)) this.emit('message', message)
  }

  interactiveMessage (payload) {
    const {parsed, replaced} = attachment.parse(payload)
    this.emit('message', parsed)
    return replaced
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

  send (channel: string, message: BotMessage) {
    const predicate = a => _.set(a, 'callbackId', this.id)
    message.attachments = message.attachments.map(predicate) as Attachment[]
    message.attachments = attachment.format(message.attachments)
    return super.send(channel, message)
  }
}
