// import * as config from 'config'
// import {post} from 'lib/utils/request'
import {EventEmitter} from 'events'
import {
   RtmClient,
   WebClient,
   RTM_EVENTS,
   CLIENT_EVENTS,
   RTM_MESSAGE_SUBTYPES
} from '@slack/client'

import { default as BotMessage } from '../types/messages/bot'
import { default as UserMessage } from '../types/messages/user'
import Adapter from '../types/adapter'

const KNOWN_EVENTS = {
  [RTM_MESSAGE_SUBTYPES.CHANNEL_JOIN]: 'slack.join',
  [RTM_MESSAGE_SUBTYPES.GROUP_JOIN]: 'slack.join'
}

import * as attachment from './helpers/attachment'

interface SlackPayload {
  text: string
  ts: string
  user?: string
  channel: string
  subtype?: string
}

const SEPARATOR = '_'

export default class SlackAdapter extends EventEmitter implements Adapter {
  profile: any
  rtmStore: any
  webClient: WebClient
  rtmClient: RtmClient
  messageChain = Promise.resolve(null)
  name?: string
  avatar?: string

  constructor (token: string, options: {name?: string, avatar?: string} = {}) {
    super()
    this.name = options.name
    this.avatar = options.avatar
    this.runClients(token)
  }

  async getChat (options: {channel?: string, user? :string}): Promise<string> {
    const {channel, user} = options
    // TODO fix this
    if (channel) {
      console.log(this.rtmStore.getChannelOrGroupByName(channel))
      return this.rtmStore.getChannelOrGroupByName(channel) + '_'
    }
    const dm = this.rtmStore.getDMByName(user)
    console.log(dm)
    if (dm) {
      return dm.id + '_'
    } else {
      const userId = this.rtmStore.getUserByName(user)
      const ret = await this.webClient.im.open(userId)
      console.log(ret)
      return ret.channel.id + '_'
    }
  }

  private runClients (slackToken: string) {
    const webClient = new WebClient(slackToken)
    const rtmClient = new RtmClient(slackToken, {logLevel: 'error'})
    rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED, d => (this.profile = d.self))
    rtmClient.on(RTM_EVENTS.MESSAGE, this.handleRtmMessage.bind(this))
    rtmClient.start()
    this.webClient = webClient
    this.rtmClient = rtmClient
    this.rtmStore = rtmClient.dataStore
  }

  // static async oauthAccess (toptalToken, code) {
  //   const {id, secret, api} = config.slack
  //   const {url} = config.app
  //   return await post({
  //     uri: api + 'oauth.access',
  //     form: {
  //       redirect_uri: `${url}authorize?token=${toptalToken}`,
  //       client_secret: secret,
  //       client_id: id,
  //       code
  //     }
  //   })
  // }

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
      chat: payload.channel + SEPARATOR + payload.user
    }

    const isBotMentioned = this.isBotMentioned(payload.text)
    const isPrivate = Boolean(this.rtmStore.getDMById(payload.channel))

    if (!isSelf && (isPrivate || isBotMentioned)) {
      this.emit('message', message)
    }
  }

  private isEvent (subtype: string): string | undefined {
    return KNOWN_EVENTS[subtype]
  }

  private isBotMentioned (text: string) {
    const idrx = new RegExp(this.profile.id, 'i')
    return idrx.test(text)
  }

  public sendMessage (message: BotMessage) {
    const {chat, text} = message
    const attachments = attachment.format(message.attachments || [])
    const channel = chat.split(SEPARATOR)[0]
    const options = {
      as_user: true,
      attachments
    }
    this.messageChain.then(() => {
      return new Promise((resolve, reject) => {
        this.webClient.chat.postMessage(channel, text, options)
          .then(resolve).catch(reject)
      })
    })
  }

  public getUser (id) {
    const user = this.rtmStore.getUserById(id)
    return {
      firstName: user.profile.first_name || `<@${id}>`,
      lastName: user.profile.last_name || '',
      handler: `<@${id}>`,
      team: user.team_id,
      name: user.name,
      id
    }
  }
}
