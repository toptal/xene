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

  public async getChat (id: string, type: string = 'direct'): Promise<string> {
    const isChannel = type == 'channel'
    const isGroup = type == 'group'
    const isDm = type == 'direct'

    if (isDm) {
      const result = await this.webClient.im.open(id)
      return result.channel.id
    }

    if (isGroup) {
      const result = await this.webClient.im.open(id)
      return result.channel.id
    }

    // TODO fix this
    // if (channel) {
    //   console.log(this.rtmStore.getChannelOrGroupByName(channel))
    //   return this.rtmStore.getChannelOrGroupByName(channel) + '_'
    // }
    // const dm = this.rtmStore.getDMByName(user)
    // console.log(dm)
    // if (dm) {
    //   return dm.id + '_'
    // } else {
    //   const userId = this.rtmStore.getUserByName(user)
    //   const ret = await this.webClient.im.open(userId)
    //   console.log(ret)
    // }
    return ''
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

  public sendMessage (channel: string, message: BotMessage) {
    let {text, attachments} = message
    attachments = attachment.format(attachments)
    const options = { as_user: true, attachments }
    this.messageChain.then(() => {
      return new Promise((resolve, reject) => {
        this.webClient.chat.postMessage(channel, text, options)
          .then(resolve).catch(reject)
      })
    })
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
      fullName: `${firstName ? firstName + ' ': '' }` + lastName,
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
