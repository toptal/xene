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

  constructor (token: string) {
    super()
    this.runClients(token)
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

    if (isPrivate || isBotMentioned) {
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
    const attachments = attachment.format(message.attachments)
    const channel = chat.split(SEPARATOR)[0]
    this.messageChain.then(() => {
      return new Promise((resolve, reject) => {
        this.webClient.chat.postMessage(channel, text, { attachments })
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
