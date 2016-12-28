import * as _ from 'lodash'
import * as request from 'request-promise-native'
import * as converters from './converters'

import Channel from './types/channel'
import {default as User, PartialUser} from './types/user'
import {default as Message, MessageOptions} from './types/message'

class ClientError extends Error {
  constructor (public message: string) {
    super()
    this.name = 'SlackClientError'
  }
}

class APIError extends ClientError {
  constructor (message: string) {
    super(`Slack API returned error code ${message}.`)
  }
}

class NotFound extends ClientError {
  constructor (type: string, args: any) {
    super(`${_.capitalize(type)} isn't found with params: ${JSON.stringify(args)}`)
  }
}

export default class Client {
  constructor (private token: string) {}

  private async call (method, form: any = {}): Promise<any> {
    const uri = `https://slack.com/api/${method}?token=${this.token}`
    form = _.mapValues(form, v => _.isObject(v) ? JSON.stringify(v) : v)
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new APIError(response.error)
      return response
    } catch (e) {
      throw e
    }
  }


  static async auth (options: {id: string, secret: string, code: string, redirectUri?: string}) {
    const uri = `https://slack.com/api/oauth.access`
    const form = {
      client_id: options.id,
      client_secret: options.secret,
      code: options.code,
      redirect_uri: options.redirectUri
    }
    try {
      const response = await request.post({ uri, json: true, form })
      if (!response.ok) throw new APIError(response.error)
      return converters.camel(response)
    } catch (e) {
      throw e
    }
  }

  async user (idOrPartialUser: string | PartialUser): Promise<User> {
    if (_.isString(idOrPartialUser)) {
      try {
        const response = await this.call('users.info', {user: idOrPartialUser})
        return converters.user(response.user)
      } catch (e) {
        throw e
      }
    }
    try {
      const users = await this.users()
      const user = _.find(users, idOrPartialUser)
      if (user) return user
      throw new NotFound('user', idOrPartialUser)
    } catch (e) {
      throw e
    }
  }

  async users (filters?: PartialUser): Promise<User[]> {
    try {
      const response = await this.call('users.list')
      let users = response.members.map(converters.user)
      return filters ? _.filter(users, filters) : users
    } catch (e) {
      throw e
    }
  }

  // TODO
  async channel (channel: string): Promise<Channel> {
    try {
      const response = await this.call('channels.info', {channel})
      return converters.camel(response.channel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async channels (): Promise<Channel[]> {
    try {
      const response = await this.call('channels.list')
      return response.channels.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async group (group: string) {
    try {
      const response = await this.call('groups.info', {group})
      return response.channels.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  // TODO
  async groups () {
    try {
      const response = await this.call('groups.list')
      return response.groups.map(converters.camel)
    } catch (e) {
      throw e
    }
  }

  async send (channel: string, message: Message, options?: MessageOptions) {
    try {
      const opts = _.merge({channel}, message, {asUser: true}, options || {})
      const response = await this.call('chat.postMessage', converters.snake(opts))
      return converters.camel(response.message)
    } catch (e) {
      throw e
    }
  }
}
