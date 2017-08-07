import * as uuid from 'uuid'
import * as _ from 'lodash'
import { Bot } from '@xene/core'

import Dispatcher from './dispatcher'
import middleware from './middleware'

import isMentioned from './helpers/is-mentioned'
import interpolate from './helpers/interpolate'
import { isPrivateChannel } from './helpers/channel-type'

import { User, Message } from './types'
import { Auth, RTM, Chat, Users, Groups, Channels } from './api'

export class Slackbot extends Bot<string | Message> {
  // Default dispatcher, used when user didn't provide
  // custom dispatcher. This is mostly used when user has
  // one type of bot, which is a common case
  static dispatcher = new Dispatcher()
  static middleware = middleware
  static oauthAccess = Auth.access

  id: string
  bot: { id: string, name: string }

  // API Modules
  rtm: RTM
  auth: Auth
  chat: Chat
  users: Users
  groups: Groups
  channels: Channels

  constructor(options: {
    id?: string,
    botToken: string,
    appToken?: string,
    dispatcher?: Dispatcher
  }) {
    super()
    this.id = options.id || uuid.v4()

    this.chat = new Chat(options.botToken)
    this.rtm = new RTM(options.botToken)
    // Some of these API scopes' methods require additional
    // scopes which are defined only for apps and app tokens respectively
    this.auth = new Auth(options.appToken || options.botToken)
    this.users = new Users(options.appToken || options.botToken)
    this.groups = new Groups(options.appToken || options.botToken)
    this.channels = new Channels(options.appToken || options.botToken)

    if (options.dispatcher) options.dispatcher.add(this.id, this)
    else Slackbot.dispatcher.add(this.id, this)
  }

  async say(chat: string, message: string | Message) {
    const init = { text: '', attachments: [] }
    message = _.isString(message) ? { ...init, text: message } : { ...init, ...message }
    message.attachments.forEach(a => a.callbackId = a.callbackId || this.id)
    return this.chat.postMessage(chat, message)
  }

  listen() {
    this.rtm.on('message', this.onRtmMessage.bind(this))
    this.rtm.connect().then(i => this.bot = i.self)
    return this
  }

  // Process new incoming RTM messages
  private onRtmMessage(payload: { ts: string, text: string, user: string, channel: string }) {
    const { user, ts, text, channel } = payload
    if (this.bot.id === user) return
    const isBotMentioned = isMentioned(this.bot.id, text)
    const isPrivate = isPrivateChannel(channel)
    if (!isPrivate && !isBotMentioned) return
    this.onMessage({ id: ts, text, user, chat: channel })
  }

  // Process incoming interactive messages
  // like button actions from slack
  // Called from Dispatcher
  async onInteractiveMessage(payload): Promise<Message> {
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

  private markActionSelected(action, attachment) {
    const selectedReplacer = ':white_check_mark: ' + action.text
    if (_.find(attachment.actions, ['value', action.value])) {
      const title = attachment.title
      delete attachment.actions
      attachment.title = title ? (title + '\n' + selectedReplacer) : selectedReplacer
    }
    return attachment
  }
}
