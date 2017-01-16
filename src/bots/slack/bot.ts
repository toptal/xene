import * as uuid from 'uuid'
import { isString, template, find } from 'lodash'

import Bot from '../../lib/bot'
import Dialog from '../../dialog'
import Command from '../../command'

import Dispatcher from './dispatcher'

import concat from './helpers/concat-values'
import isMentioned from './helpers/is-mentioned'
import isKnownEvent from './helpers/is-known-event'
import { isPrivateChannel } from './helpers/channel-type'
import { RtmClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client'

import IUser from './api/types/user'
import { IMessage } from './api/types/message'
export type Message = string | IMessage

// API Modules
import Auth from './api/auth'
import Chat from './api/chat'
import Users from './api/users'
import Groups from './api/groups'
import Channels from './api/channels'

export default class Slackbot extends Bot<Message, IUser> {
  // Default dispatcher, used when user didn't provide
  // custom dispatcher. This is moslty used when user has
  // one type of bot, which is a common case
  static dispatcher = new Dispatcher()
  static oauthAccess = Auth.access

  id: string
  botId: string
  rtmClient: RtmClient

  // API Modules
  auth: Auth
  chat: Chat
  users: Users
  groups: Groups
  channels: Channels

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

  getUser(id: string) { return this.users.info(id) }

  formatMessage(message: Message, object: any): Message {
    if (isString(message)) {
      return template(message, { imports: object })()
    }
    const text = template(message.text, { imports: object })()
    return { ...message, text }
  }

  async sendMessage(chat: string, message: Message, options?: any) {
    if (isString(message)) message = { text: message, attachments: [] }
    message.attachments = concat(message.attachment, message.attachments)
    message.attachments.forEach(a => a.callbackId = this.id)
    return this.chat.postMessage(chat, message)
  }

  // Process incoming interactive messages
  // like button actions from slack.
  // Called from Dispatcher
  onInteractiveMessage(payload): Message {
    const selected = payload.actions[0]
    const text = payload.originalMessage.text
    let attachments = payload.originalMessage.attachments
    attachments = attachments.map(this.markActionSelected.bind(this, selected))
    this.onMessage({
      id: payload.ts,
      text: selected.value,
      chat: payload.channel.id,
      user: payload.user.id
    })
    return { text, attachments }
  }

  markActionSelected(action, attachment) {
    const selectedReplacer = ':white_check_mark: ' + action.name
    if (find(attachment.actions, ['value', action.value])) {
      const title = attachment.title
      delete attachment.actions
      attachment.title = title ? (title + '\n' + selectedReplacer) : selectedReplacer
    }
    return attachment
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
    this.rtmClient = new RtmClient(token, { logLevel: 'error' })
    this.rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.botId = d.self.id))
    this.rtmClient.on(RTM_EVENTS.MESSAGE, this.onRtmMessage.bind(this))
    this.auth = new Auth(token)
    this.chat = new Chat(token)
    this.users = new Users(token)
    this.groups = new Groups(token)
    this.channels = new Channels(token)
    this.rtmClient.start()
  }
}
