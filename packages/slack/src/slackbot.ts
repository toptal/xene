import { isString } from 'lodash'
import { Bot } from '@xene/core'

import { middleware } from './middleware'
import { interpolate } from './helpers/interpolate'
import { isMentioned } from './helpers/is-mentioned'
import { isPrivateChannel } from './helpers/channel-type'

import { User, Message, MiddlewareContext } from './types'
import { Oauth, Auth, RTM, Chat, Users, Groups, Channels, Files } from './api'

export class Slackbot extends Bot<string | Message> {
  static Oauth = Oauth

  static dispatch = (ctx: MiddlewareContext) => {
    const { team, action, channel: { id: channel }, user: { id: user } } = ctx
    const slackbot = Slackbot.bots.find(b => b.self.team.id === team.id)
    const selectedReplacer = `*:white_check_mark: ${action.value}*`
    ctx.message.attachments!.forEach(a => {
      if (!a.menus.some(m => m.id === action.id) &&
        !a.buttons.some(m => m.id === action.id)) return
      a.text = a.text ? `${a.text}\n${selectedReplacer}` : selectedReplacer
      a.menus = []
    })
    slackbot.onMessage({ id: Date.now().toString(), channel, text: action.value, user })
  }

  static middleware = middleware(Slackbot.dispatch)
  private static bots: Slackbot[] = []

  self: {
    id: string, name: string
    team: { id: string, title: string }
  }

  // API Modules
  rtm = new RTM(this.token)
  auth = new Auth(this.token)
  chat = new Chat(this.token)
  users = new Users(this.token)
  files = new Files(this.token)
  groups = new Groups(this.token)
  channels = new Channels(this.token)

  constructor(private token: string | { appToken?: string, botToken?: string }) {
    super()
    this.selfIdentify()
    Slackbot.bots.push(this)
  }

  async say(channel: string, message: string | Message) {
    const init = { text: '', attachments: [] }
    message = isString(message) ? { ...init, text: message } : { ...init, ...message }
    return this.chat.postMessage(channel, message)
  }

  /**
   * Connect to Slack RTM API
   */
  listen() {
    this.rtm.on('message', this.onRtmMessage.bind(this))
    return this
  }

  /**
   * Process new incoming RTM messages
   */
  private onRtmMessage(payload: { ts: string, text: string, user: string, channel: string }) {
    const { user, ts, text, channel } = payload
    if (this.self.id === user) return
    const isBotMentioned = isMentioned(this.self.id, text)
    const isPrivate = isPrivateChannel(channel)
    if (!isPrivate && !isBotMentioned) return
    this.onMessage({ id: ts, text, user, channel })
  }

  private async selfIdentify() {
    const { team, teamId, user, userId: id } = await this.auth.test()
    this.self = { id, name: user, team: { id: teamId, title: team } }
  }
}
