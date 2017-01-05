import * as _ from 'lodash'
import * as request from 'request-promise-native'
import * as Errors from './errors'
import * as converters from './helpers/converters'
import formatAttachment from './helpers/format-attachment'

import User from './types/user'
import Channel from './types/channel'
import { IMessage, IOptions as IMessageOptions } from './types/message'

export default class Client {

  static async auth(options: { id: string, secret: string, code: string, redirectUri?: string }) {
    const uri = `https://slack.com/api/oauth.access`
    const form = {
      client_id: options.id,
      client_secret: options.secret,
      code: options.code,
      redirect_uri: options.redirectUri
    }
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new Errors.API(response.error)
      return converters.camel(response)
    } catch (e) {
      throw e
    }
  }

  constructor(public token: string) { }

  async getUser(idOrPartialUser: string | Partial<User>): Promise<User> {
    if (_.isString(idOrPartialUser)) {
      try {
        const response = await this.call('users.info', { user: idOrPartialUser })
        return converters.user(response.user)
      } catch (e) {
        throw e
      }
    }
    try {
      const users = await this.getUsers()
      const user = _.find(users, idOrPartialUser)
      if (user) return user
      throw new Errors.NotFound('user', idOrPartialUser)
    } catch (e) {
      throw e
    }
  }

  async getUsers(filter?: Partial<User>): Promise<User[]> {
    try {
      const response = await this.call('users.list')
      let users = response.members.map(converters.user)
      return filter ? _.filter(users, filter) : users
    } catch (e) {
      throw e
    }
  }

  // TODO
  async channel(channel: string): Promise<Channel> {
    try {
      const response = await this.call('channels.info', { channel })
      return converters.camel(response.channel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async channels(): Promise<Channel[]> {
    try {
      const response = await this.call('channels.list')
      return response.channels.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async group(group: string) {
    try {
      const response = await this.call('groups.info', { group })
      return response.channels.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async groups() {
    try {
      const response = await this.call('groups.list')
      return response.groups.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  async send(channel: string, {text, attachments}: IMessage, options?: IMessageOptions) {
    attachments = [].concat(attachments).map<any>(formatAttachment)
    const opts = _.merge({attachments, text, channel, asUser: true }, options || {})
    try {
      const response = await this.call('chat.postMessage', converters.snake(opts))
      return converters.camel(response.message)
    } catch (e) {
      throw e
    }
  }

  private async call(method, form: any = {}): Promise<any> {
    const uri = `https://slack.com/api/${method}?token=${this.token}`
    form = _.mapValues(form, v => _.isObject(v) ? JSON.stringify(v) : v)
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new Errors.API(response.error)
      return response
    } catch (e) {
      throw e
    }
  }
}
