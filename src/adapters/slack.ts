// import * as config from 'config'
// import {post} from 'lib/utils/request'
import * as _ from 'lodash'
import {EventEmitter} from 'events'
import {
   RtmClient,
   WebClient,
   RTM_EVENTS,
   CLIENT_EVENTS,
   RTM_MESSAGE_SUBTYPES
} from '@slack/client'

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

  public async getChat (id: string, type: string = 'direct'): Promise<string> {
    const isChannel = type == 'channel'
    const isGroup = type == 'group'
    const isDm = type == 'direct'

    // id is an id of existing channel, group or dm
    let chat = this.rtmStore.getChannelGroupOrDMById(id)
    if (chat) return chat.id

    // id is an id of user
    if (isDm) {
      try {
        chat = await this.webClient.im.open(id)
        return chat.channel.id
      } catch (e) {
        throw new Error(e)
      }
    }

    // id is an name of existing channel or group
    if (isChannel) {
      chat = this.rtmStore.getChannelByName(id);

      if (chat) {
        try {
          await this.webClient.channels.join(id)
          return chat.id
        } catch (e) {
          throw new Error(`Can't join channel '${id}' — ${e.toString()}`)
        }
      }

      try {
        chat = await this.webClient.channels.create(id)
        return chat.id
      } catch (e) {
        throw new Error(`Can't create channel '${id}' — ${e.toString()}`)
      }
    }

    if (isGroup) {
      chat = this.rtmStore.getGroupByName(id);
      if (chat) return chat.id

      try {
        chat = await this.webClient.groups.create(id)
        return chat.id
      } catch (e) {
        throw new Error(`Can't create group '${id}' — ${e.toString()}`)
      }
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
      chat: payload.channel,
      type: this.chatType(payload.channel)
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
    let {text, attachments} = message
    attachments = attachment.format(attachments)
    const options = { as_user: true, attachments }
    const request = new Promise((resolve, reject) => {
      this.webClient.chat.postMessage(channel, text, options)
        .then(resolve).catch(reject)
    })
    this.messageChain.then(() => request)
    return request
  }

  public findUser (idOrTerm: string | SearchUser): User {
    let user
    if (_.isString(idOrTerm)) {
      user = this.rtmStore.getUserById(idOrTerm)
    } else if (idOrTerm.email) {
      user = this.rtmStore.getUserByEmail(idOrTerm.email)
    } else if (idOrTerm.handler) {
      user = this.rtmStore.getUserByName(idOrTerm.handler)
    }

    const firstName = user.profile.first_name || ''
    const lastName = user.profile.last_name || ''

    return {
      id: user.id,
      email: user.profile.email,
      handler: `<@${user.id}>`,
      fullName: firstName + `${lastName ? ' ' + lastName : '' }`,
      firstName,
      lastName
    }
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
