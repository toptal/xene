import * as uuid from 'uuid'
import { isString, template } from 'lodash'

import Bot from '../../lib/bot'
import Dialog from '../../dialog'
import Command from '../../command'

import ApiClient from './client'
import Dispatcher from './dispatcher'
import isMentioned from './helpers/is-mentioned'
import isKnownEvent from './helpers/is-known-event'
import { isPrivateChannel } from './helpers/channel-type'
import { RtmClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'

import User from './types/user'
import { IMessage } from './types/message'
export type Message = string | IMessage

export default class Slackbot extends Bot<Message, User> {
  // Default dispatcher, used when user didn't provide
  // custom dispatcher. This is moslty used when user has
  // one type of bot, which is a common case
  static dispatcher = new Dispatcher()

  id: string
  botId: string
  rtmClient: RtmClient
  apiClient: ApiClient

  constructor(options: {
    id?: string,
    token: string,
    dialogs: (typeof Dialog)[],
    commands?: (typeof Command)[],
    dispatcher?: Dispatcher
  }) {
    super(options)
    this.id = options.id || uuid.v4()
    this.initClients(options.token)
    if (options.dispatcher) options.dispatcher.add(this.id, this)
    else Slackbot.dispatcher.add(this.id, this)
  }

  getUser(idOrfilter: string | Partial<User>) {
    return this.apiClient.getUser(idOrfilter)
  }

  getUsers(filter: Partial<User>) {
    return this.apiClient.getUsers(filter)
  }

  formatMessage(message: Message, object: any): Message {
    if (isString(message)) {
      return template(message, { imports: object })()
    } else {
      const text = template(message.text, { imports: object })()
      return Object.assign({}, message, { text })
    }
  }

  async sendMessage(chat: string, message: Message, options?: any) {
    if (!isString(message)) {
      let attachments = [].concat(message.attachment || message.attachments)
      attachments = attachments.map(a => a.callbackId = this.id)
      this.apiClient.send(chat, { text: message.text, attachments })
    } else {
      this.apiClient.send(chat, { text: message })
    }
  }

  // Process incoming interactive messages
  // like button actions from slack.
  // Called from Dispatcher
  onInteractiveMessage(payload) {
    // const {parsed, replaced} = attachment.parse(payload)
    // this.bot.onMessage(parsed)
    // return replaced
  }

  // Process new incoming RTM messages
  // incoming from rtm client
  private onRtmMessage(payload: {
    ts: string,
    text: string,
    user?: string,
    channel: string,
    subtype?: string
  }) {
    if (!payload.user) return
    const isSelf = this.botId === payload.user
    const isEvent = isKnownEvent(payload.subtype)

    // TODO process known events and call specific callbacks
    if (isSelf && isEvent) return
    if (isSelf) return

    const isBotMentioned = isMentioned(this.id, payload.text)
    const isPrivate = isPrivateChannel(payload.channel)
    if (!isPrivate && !isBotMentioned) return

    this.onMessage({
      id: payload.ts,
      text: payload.text,
      user: payload.user,
      chat: payload.channel
    })
  }

  private initClients(token: string) {
    this.apiClient = new ApiClient(token)
    this.rtmClient = new RtmClient(token, { logLevel: 'error' })
    this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.id = d.self.id))
    this.rtmClient.on(RTM_EVENTS.MESSAGE, this.onRtmMessage.bind(this))
    this.rtmClient.start()
  }
}
