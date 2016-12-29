import * as uuid from 'uuid'
import Bot from '../../lib/bot'
import Dialog from '../../dialog'
import Command from '../../command'

import Dispatcher from './dispatcher'
import IAttachment from './attachment-type'
import isMentioned from './helpers/is-mentioned'
import isKnownEvent from './helpers/is-known-event'
import { isPrivateChannel } from './helpers/channel-type'
import { RtmClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'


export type Message = string | {
  text?: string
  attachment?: IAttachment
  attachments?: IAttachment[]
}

export default class Slackbot extends Bot<Message, any> {
  id: string
  botId: string
  rtmClient: RtmClient

  // Default dispatcher, used when user didn't provide
  // custom dispatcher. This is moslty used when user rans
  // one type of bot, which is a common case
  static dispatcher = new Dispatcher()

  constructor(options: {
    id?: string,
    token: string,
    dialogs: (typeof Dialog)[],
    commands?: (typeof Command)[],
    dispatcher: Dispatcher
  }) {
    super(options)
    this.id = options.id || uuid.v4()
    this.initClients(options.token)
    if (options.dispatcher) options.dispatcher.add(this.id, this)
    else Slackbot.dispatcher.add(this.id, this)
  }

  private initClients(slackToken: string) {
    const rtmClient = new RtmClient(slackToken, { logLevel: 'error' })
    rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.id = d.self.id))
    rtmClient.on(RTM_EVENTS.MESSAGE, this.onRtmMessage.bind(this))
    rtmClient.start()
    this.rtmClient = rtmClient
  }

  // Process new incoming RTM messages
  // incoming from rtm client
  private onRtmMessage(payload: {
    ts: string, text: string, user?: string, channel: string, subtype?: string
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

  // Process incoming interactive messages
  // like button actions from slack.
  // Called from Dispatcher
  onInteractiveMessage(payload) {
    // const {parsed, replaced} = attachment.parse(payload)
    // this.bot.onMessage(parsed)
    // return replaced
  }

  formatMessage(message: Message, object: any): Message { return { text: 's' } }

  // replace
  async user() { return { name: 'dempfi' } }
  async users() { return [{ name: 'dempfi' }] }
  async send(chat: string, message: Message) { }
}
